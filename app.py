from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import sys
import subprocess
import threading
import requests
from datetime import datetime, timedelta
from typing import Optional, List
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv(override=True)  # Force reload to override any cached values

# Add the current directory to Python path to import fingent_ai_working
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# NewsAPI Configuration
NEWS_API_KEY = os.getenv('NEWS_API_KEY')
NEWS_API_URL = "https://newsapi.org/v2/everything"

# Google Gemini Configuration (FREE LLM)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
print(f"DEBUG - Raw API key from env: '{GEMINI_API_KEY}'")
print(f"DEBUG - Key length: {len(GEMINI_API_KEY) if GEMINI_API_KEY else 0}")
print(f"Gemini API Key configured: {bool(GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_key_here')}")

if GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_key_here' and len(GEMINI_API_KEY) > 10:
    try:
        genai.configure(api_key=GEMINI_API_KEY.strip())
        gemini_model = genai.GenerativeModel('gemini-pro')
        print("✅ Gemini AI model initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing Gemini: {e}")
        gemini_model = None
else:
    gemini_model = None
    print("⚠️ Gemini API key not configured. Using fallback responses.")

app = FastAPI(title="Fingent AI", description="Personal Financial Advisory Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup Jinja2 templates
templates = Jinja2Templates(directory="templates")

# Pydantic models
class ChatMessage(BaseModel):
    message: str

class PhoneCall(BaseModel):
    phone_number: str

class SavingsAdvice(BaseModel):
    income: float
    expenses: float


# Import the Fingent AI functionality
try:
    import sys
    import io
    # Suppress Streamlit warnings when importing
    old_stderr = sys.stderr
    sys.stderr = io.StringIO()
    
    from fingent_ai_working import make_real_outbound_call, validate_phone_number
    
    sys.stderr = old_stderr
except ImportError:
    # Fallback if the module can't be imported
    def make_real_outbound_call(phone_number):
        return {
            "status": "success",
            "message": "Call simulation successful",
            "conversation_id": "sim_123456",
            "call_sid": "sim_call_123"
        }
    
    def validate_phone_number(phone_number):
        import re
        cleaned = re.sub(r'[^\d+]', '', phone_number)
        if not cleaned.startswith('+'):
            return False, "Phone number must start with +"
        digits_only = cleaned[1:]
        if len(digits_only) < 10 or len(digits_only) > 15:
            return False, "Phone number must have 10-15 digits after the +"
        return True, cleaned

@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/launch-agent")
async def launch_agent():
    """Launch the Fingent AI Streamlit agent in a new window"""
    try:
        # Launch Streamlit app in a separate process
        streamlit_file = os.path.join(os.path.dirname(__file__), 'fingent_ai_working.py')
        
        def run_streamlit():
            subprocess.Popen(
                ['streamlit', 'run', streamlit_file, '--server.port', '8501'],
                creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
            )
        
        # Run in a separate thread to not block the server
        thread = threading.Thread(target=run_streamlit, daemon=True)
        thread.start()
        
        # Return success with redirect URL
        return {
            "status": "success",
            "message": "Fingent AI Agent is launching...",
            "url": "http://localhost:8501"
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"Failed to launch agent: {str(e)}"
            }
        )

@app.get("/api/news")
async def get_news(category: str = None):
    """Get latest financial news from NewsAPI"""
    
    # Check if API key is configured
    if not NEWS_API_KEY:
        print("NewsAPI key not configured, using fallback data")
        return get_fallback_news(category)
    
    try:
        # Map categories to search terms
        category_keywords = {
            'crypto': 'cryptocurrency OR bitcoin OR ethereum OR blockchain',
            'economy': 'economy OR "federal reserve" OR inflation OR GDP',
            'stocks': '"stock market" OR NYSE OR NASDAQ OR "dow jones"',
            'markets': '"financial markets" OR trading OR "wall street"',
            'investing': 'investing OR investment OR portfolio OR "mutual funds"',
            'real-estate': '"real estate" OR property OR "housing market" OR mortgage'
        }
        
        # Build query based on category
        if category and category.lower() in category_keywords:
            query = category_keywords[category.lower()]
        else:
            query = 'finance OR investing OR "stock market" OR economy'
        
        # API parameters
        params = {
            'q': query,
            'apiKey': NEWS_API_KEY,
            'language': 'en',
            'sortBy': 'publishedAt',
            'pageSize': 20,
            'from': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        }
        
        # Fetch news from API
        response = requests.get(NEWS_API_URL, params=params, timeout=10)
        data = response.json()
        
        if data.get('status') == 'ok' and data.get('articles'):
            news_list = []
            for article in data['articles']:
                # Skip articles without title or description
                if not article.get('title') or article['title'] == '[Removed]':
                    continue
                    
                news_list.append({
                    'title': article['title'],
                    'description': article.get('description') or 'No description available',
                    'url': article.get('url', '#'),
                    'urlToImage': article.get('urlToImage') or get_default_image(category),
                    'publishedAt': article.get('publishedAt', datetime.now().isoformat()),
                    'source': {
                        'name': article['source']['name'] if article.get('source') else 'Unknown'
                    }
                })
            
            # Return in the format frontend expects
            return {
                'articles': news_list[:20] if news_list else get_fallback_news(category)['articles'],
                'totalResults': len(news_list)
            }
        else:
            print(f"NewsAPI returned status: {data.get('status')}, message: {data.get('message', 'Unknown error')}")
            return get_fallback_news(category)
            
    except requests.exceptions.Timeout:
        print("NewsAPI request timed out")
        return get_fallback_news(category)
    except Exception as e:
        print(f"NewsAPI error: {e}")
        return get_fallback_news(category)

def determine_category(title: str) -> str:
    """Determine category based on article title"""
    title_lower = title.lower()
    if any(word in title_lower for word in ['bitcoin', 'crypto', 'ethereum', 'blockchain']):
        return 'Crypto'
    elif any(word in title_lower for word in ['fed', 'federal reserve', 'inflation', 'economy', 'gdp']):
        return 'Economy'
    elif any(word in title_lower for word in ['stock', 'nyse', 'nasdaq', 'dow']):
        return 'Stocks'
    elif any(word in title_lower for word in ['real estate', 'property', 'housing']):
        return 'Real Estate'
    elif any(word in title_lower for word in ['invest', 'portfolio', 'fund']):
        return 'Investing'
    else:
        return 'Markets'

def get_default_image(category: str = None) -> str:
    """Get default image based on category"""
    images = {
        'crypto': 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
        'economy': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        'stocks': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800',
        'markets': 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800',
        'investing': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
        'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
    }
    return images.get(category.lower() if category else 'markets', images['markets'])

def get_fallback_news(category: str = None):
    """Fallback news data when API is unavailable"""
    today = datetime.now().isoformat()
    all_news = [
        {
            "title": "Bitcoin Surges Past $50,000 as Institutional Adoption Grows",
            "description": "Bitcoin has reached a new milestone as major financial institutions continue to show interest in cryptocurrency investments.",
            "url": "#",
            "urlToImage": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800",
            "publishedAt": today,
            "source": {"name": "Financial Times"},
            "category": "Crypto"
        },
        {
            "title": "Federal Reserve Signals Potential Rate Cuts in 2024",
            "description": "The Federal Reserve has indicated possible interest rate reductions as inflation continues to moderate.",
            "url": "#",
            "urlToImage": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
            "publishedAt": today,
            "source": {"name": "Bloomberg"},
            "category": "Economy"
        },
        {
            "title": "Tech Stocks Rally on Strong Earnings Reports",
            "description": "Major technology companies have reported better-than-expected earnings, driving market optimism.",
            "url": "#",
            "urlToImage": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800",
            "publishedAt": today,
            "source": {"name": "CNBC"},
            "category": "Stocks"
        },
        {
            "title": "Global Markets React to Economic Policy Changes",
            "description": "International markets are responding to new economic policies and trade agreements.",
            "url": "#",
            "urlToImage": "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800",
            "publishedAt": today,
            "source": {"name": "Reuters"},
            "category": "Markets"
        },
        {
            "title": "Sustainable Investing Gains Momentum",
            "description": "ESG-focused investment strategies are becoming increasingly popular among institutional investors.",
            "url": "#",
            "urlToImage": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
            "publishedAt": today,
            "source": {"name": "Wall Street Journal"},
            "category": "Investing"
        },
        {
            "title": "AI Revolution Transforms Financial Services",
            "description": "Artificial intelligence is reshaping how financial institutions operate and serve customers.",
            "url": "#",
            "urlToImage": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
            "publishedAt": today,
            "source": {"name": "Financial Times"},
            "category": "Markets"
        }
    ]
    
    # Filter by category if provided
    if category and category != 'all':
        filtered = [n for n in all_news if n['category'].lower() == category.lower()]
        articles = filtered if filtered else all_news[:6]
    else:
        articles = all_news[:6]
    
    return {
        'articles': articles,
        'totalResults': len(articles)
    }

@app.post("/api/chat")
async def chat(message: ChatMessage):
    """Handle chat messages with Fingent AI"""
    # Generate AI response based on the message
    response = generate_ai_response(message.message)
    
    return {
        "response": response,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/call")
async def make_call(call: PhoneCall):
    """Make an outbound call using Fingent AI"""
    # Validate phone number
    is_valid, validation_result = validate_phone_number(call.phone_number)
    
    if not is_valid:
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": validation_result
            }
        )
    
    # Make the call
    try:
        call_result = make_real_outbound_call(validation_result)
        return call_result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"Call failed: {str(e)}"
            }
        )

@app.post("/api/savings/advice")
async def get_savings_advice(advice: SavingsAdvice):
    """Get personalized savings advice based on income and expenses"""
    
    income = advice.income
    expenses = advice.expenses
    savings = income - expenses
    savings_rate = (savings / income * 100) if income > 0 else 0
    
    # Generate AI advice using Gemini
    if gemini_model:
        try:
            prompt = f"""You are a financial advisor. A user has:
- Monthly Income: ${income:,.2f}
- Monthly Expenses: ${expenses:,.2f}
- Monthly Savings: ${savings:,.2f}
- Savings Rate: {savings_rate:.1f}%

Provide personalized savings advice in 3-4 sentences. Include:
1. Assessment of their current savings rate
2. Specific actionable recommendations
3. Suggested savings targets or strategies"""

            response = gemini_model.generate_content(prompt)
            
            if response and response.text:
                return {
                    "advice": response.text.strip(),
                    "stats": {
                        "monthly_savings": savings,
                        "savings_rate": round(savings_rate, 2)
                    }
                }
        except Exception as e:
            print(f"Error generating savings advice: {e}")
    
    # Fallback advice
    if savings_rate < 10:
        advice_text = f"Your current savings rate is {savings_rate:.1f}%. Try to reduce expenses or increase income to save at least 20% of your income. Consider tracking all expenses and cutting non-essential spending."
    elif savings_rate < 20:
        advice_text = f"Good start! You're saving {savings_rate:.1f}% of your income. Aim for 20% or more by identifying areas to reduce spending or finding ways to increase income."
    else:
        advice_text = f"Excellent! You're saving {savings_rate:.1f}% of your income. Consider investing your savings in index funds, retirement accounts, or building an emergency fund of 6 months expenses."
    
    return {
        "advice": advice_text,
        "stats": {
            "monthly_savings": savings,
            "savings_rate": round(savings_rate, 2)
        }
    }

def generate_ai_response(message):
    """Generate AI response using Google Gemini (Free LLM) with financial expertise"""
    
    print(f"📩 Received message: {message}")
    print(f"🤖 Gemini model available: {gemini_model is not None}")
    
    # Try using Gemini AI if configured
    if gemini_model:
        try:
            print("🔄 Calling Gemini API...")
            # Financial advisor system prompt
            financial_prompt = f"""You are Fingent AI, a professional financial advisor with expertise in:
- Personal finance and budgeting
- Investment strategies (stocks, bonds, crypto, ETFs)
- Retirement planning (401k, IRA, pension)
- Debt management and credit optimization
- Tax planning strategies
- Real estate investment
- Risk management and insurance

Provide clear, actionable, and responsible financial advice. Always remind users to:
- Consult with licensed professionals for major decisions
- Consider their personal financial situation
- Understand risks before investing

User Question: {message}

Provide a concise, helpful response (2-4 sentences max):"""

            response = gemini_model.generate_content(financial_prompt)
            
            if response and response.text:
                print(f"✅ Gemini response received: {response.text[:100]}...")
                return response.text.strip()
            else:
                print("⚠️ Gemini returned empty response")
                return get_fallback_response(message)
                
        except Exception as e:
            print(f"❌ Gemini API error: {type(e).__name__}: {e}")
            return get_fallback_response(message)
    
    print("⚠️ Using fallback response (Gemini not configured)")
    # Use fallback response if Gemini not configured
    return get_fallback_response(message)

def get_fallback_response(message):
    """Simple fallback response when LLM is unavailable"""
    return "I'm Fingent AI, your financial advisor. I can help you with budgeting, investing, savings, retirement planning, debt management, and more. To enable advanced AI responses, please configure your Gemini API key in the .env file. How can I assist you with your financial goals today?"


def generate_personalized_advice(country, state, age_group):
    """Generate personalized financial advice based on user criteria"""
    advice = {
        'budgeting': {
            '15-24': [
                'Start with a simple 50/30/20 budget: 50% needs, 30% wants, 20% savings',
                'Use apps like Mint or YNAB to track spending automatically',
                'Focus on building good financial habits early',
                'Consider part-time work or side hustles for extra income',
                'Learn to cook at home to save on food expenses'
            ],
            '25-40': [
                'Create a detailed budget including housing, transportation, and healthcare',
                'Automate bill payments to avoid late fees',
                'Review and cancel unnecessary subscriptions monthly',
                'Consider refinancing high-interest debt',
                'Build an emergency fund covering 3-6 months of expenses'
            ],
            '41-60': [
                'Focus on debt reduction and retirement planning',
                'Consider downsizing or relocating for better cost of living',
                'Maximize retirement account contributions',
                'Review insurance coverage and costs',
                'Plan for children\'s education expenses'
            ],
            '60+': [
                'Adjust budget for retirement income',
                'Focus on healthcare and long-term care planning',
                'Consider reverse mortgages or downsizing',
                'Review and optimize Medicare coverage',
                'Plan for estate and legacy considerations'
            ]
        },
        'investing': {
            '15-24': [
                'Start with index funds or ETFs for diversification',
                'Consider opening a Roth IRA for tax-free growth',
                'Focus on long-term growth over short-term gains',
                'Learn about compound interest and time value of money',
                'Start small and increase contributions over time'
            ],
            '25-40': [
                'Diversify across stocks, bonds, and real estate',
                'Maximize employer retirement plan contributions',
                'Consider alternative investments like REITs or commodities',
                'Regularly rebalance your portfolio',
                'Focus on tax-efficient investing strategies'
            ],
            '41-60': [
                'Shift towards more conservative investments',
                'Maximize catch-up contributions to retirement accounts',
                'Consider annuities for guaranteed income',
                'Review and adjust risk tolerance',
                'Plan for required minimum distributions'
            ],
            '60+': [
                'Focus on income-generating investments',
                'Consider dividend-paying stocks and bonds',
                'Plan for required minimum distributions',
                'Review estate planning and beneficiary designations',
                'Consider working with a financial advisor'
            ]
        }
    }
    
    return advice.get('budgeting', {}).get(age_group, []) + advice.get('investing', {}).get(age_group, [])

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
