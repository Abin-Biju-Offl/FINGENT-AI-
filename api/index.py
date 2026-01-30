from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq
import requests
from datetime import datetime, timedelta
from typing import Optional, List
import json

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="Fingent AI API",
    description="Lightweight API handler for Fingent AI",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys
GROQ_API_KEY = os.getenv('GROQ_API_KEY', '').strip()
NEWS_API_KEY = os.getenv('NEWS_API_KEY', '').strip()
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '').strip()
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '').strip()

# Initialize Groq
groq_client = None
if GROQ_API_KEY and len(GROQ_API_KEY) > 10:
    try:
        groq_client = Groq(api_key=GROQ_API_KEY)
        print(f"✅ Groq initialized successfully")
    except Exception as e:
        print(f"❌ Groq error: {e}")
else:
    print(f"❌ GROQ_API_KEY not found or invalid. Key length: {len(GROQ_API_KEY) if GROQ_API_KEY else 0}")

# ============ DATA MODELS ============
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    timestamp: str

class PhoneCall(BaseModel):
    phone_number: str

class SavingsAdviceRequest(BaseModel):
    income: float
    expenses: float

# ============ HEALTH CHECK ============
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "groq_ready": groq_client is not None
    }

# ============ CHAT ENDPOINT ============
@app.post("/api/chat")
async def chat(message: ChatMessage):
    """AI Chat endpoint using Groq"""
    try:
        if not groq_client:
            return ChatResponse(
                response="Groq API not configured. Please set GROQ_API_KEY.",
                timestamp=datetime.now().isoformat()
            )
        
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

User Question: {message.message}

Provide a concise, helpful response (2-4 sentences max):"""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": financial_prompt}],
            temperature=0.7,
            max_tokens=1024
        )
        
        return ChatResponse(
            response=response.choices[0].message.content.strip() if response.choices else "Unable to generate response",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        return ChatResponse(
            response=f"Error: {str(e)}",
            timestamp=datetime.now().isoformat()
        )

# ============ NEWS ENDPOINT ============
@app.get("/api/news")
async def get_news(category: str = "all"):
    """Get financial news"""
    try:
        if not NEWS_API_KEY:
            return {
                "articles": [],
                "totalResults": 0,
                "message": "News API not configured"
            }
        
        # Map categories to search queries
        query_map = {
            "crypto": "cryptocurrency bitcoin ethereum",
            "stocks": "stock market S&P 500",
            "economy": "economy inflation interest rates",
            "real-estate": "real estate property market",
            "investing": "investing investment portfolio",
            "all": "finance financial markets"
        }
        
        query = query_map.get(category.lower(), "finance")
        
        params = {
            "q": query,
            "apiKey": NEWS_API_KEY,
            "sortBy": "publishedAt",
            "language": "en",
            "pageSize": 10
        }
        
        response = requests.get(
            "https://newsapi.org/v2/everything",
            params=params,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok':
                return {
                    "articles": data.get('articles', [])[:10],
                    "totalResults": len(data.get('articles', []))
                }
        
        return {"articles": [], "totalResults": 0}
    except Exception as e:
        print(f"News error: {e}")
        return {"articles": [], "totalResults": 0}

# ============ SAVINGS ADVICE ENDPOINT ============
@app.post("/api/savings/advice")
async def get_savings_advice(request: SavingsAdviceRequest):
    """Get personalized savings advice"""
    try:
        if not groq_client:
            return {
                "advice": "Configure Groq API for personalized advice"
            }
        
        if request.income <= 0:
            return {"advice": "Please provide valid income information"}
        
        savings_rate = ((request.income - request.expenses) / request.income * 100) if request.income > 0 else 0
        
        prompt = f"""As a financial advisor, provide specific savings advice for someone with:
- Monthly Income: ${request.income:,.2f}
- Monthly Expenses: ${request.expenses:,.2f}
- Savings Rate: {savings_rate:.1f}%

Give 2-3 actionable, specific recommendations in 3-4 sentences max. Be practical and realistic."""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=512
        )
        
        return {
            "advice": response.choices[0].message.content.strip() if response.choices else "Unable to generate advice",
            "savings_rate": round(savings_rate, 2),
            "monthly_savings": round(request.income - request.expenses, 2)
        }
    except Exception as e:
        return {"advice": f"Error: {str(e)}"}

# ============ PHONE CALL ENDPOINT ============
@app.post("/api/call")
async def make_phone_call(call: PhoneCall):
    """Make outbound call (Twilio integration)"""
    try:
        if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": "Twilio not configured"
                }
            )
        
        # Basic phone number validation
        phone = call.phone_number.strip()
        if not phone.startswith('+'):
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": "Phone number must start with +"
                }
            )
        
        # In production, use Twilio SDK to make call
        # For now, return success response
        return {
            "status": "success",
            "message": f"Call initiated to {phone}",
            "call_id": f"call_{datetime.now().timestamp()}"
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

# ============ ROOT ENDPOINT ============
@app.get("/api")
async def root():
    """API root endpoint"""
    return {
        "name": "Fingent AI API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": [
            "/api/health",
            "/api/chat",
            "/api/news",
            "/api/savings/advice",
            "/api/call"
        ]
    }

# ============ FALLBACK FOR SPA ============
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str):
    """Fallback for React SPA - return 404 for non-API paths"""
    if full_path.startswith("api/"):
        return JSONResponse(status_code=404, content={"error": "Endpoint not found"})
    return JSONResponse(status_code=404, content={"error": "Not found"})
