from fastapi import FastAPI, Request, Form
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq
import requests
from datetime import datetime, timedelta
from typing import Optional, List
import json
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather

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
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+18447971620').strip()

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

# Initialize Twilio
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        print(f"✅ Twilio initialized successfully")
    except Exception as e:
        print(f"❌ Twilio error: {e}")

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
    """Make outbound call with AI voice agent (Twilio + Groq)"""
    try:
        if not twilio_client:
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
                    "message": "Phone number must start with + (e.g., +1XXXXXXXXXX)"
                }
            )
        
        # Make actual Twilio call
        try:
            # Use ngrok or deployed URL for webhook
            # For development, you need to expose your local server
            base_url = os.getenv('API_BASE_URL', 'http://localhost:8000')
            
            call_obj = twilio_client.calls.create(
                to=phone,
                from_=TWILIO_PHONE_NUMBER,
                url=f"{base_url}/api/voice/welcome",
                method='POST'
            )
            
            return {
                "status": "success",
                "message": f"Call initiated to {phone}",
                "call_sid": call_obj.sid,
                "to_number": phone,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as twilio_error:
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "message": f"Twilio error: {str(twilio_error)}"
                }
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

# ============ TWILIO VOICE WEBHOOKS ============
@app.post("/api/voice/welcome")
async def voice_welcome(request: Request):
    """Initial voice message when call connects"""
    response = VoiceResponse()
    
    gather = Gather(
        input='speech',
        action='/api/voice/process',
        method='POST',
        speech_timeout='auto',
        language='en-US'
    )
    
    gather.say(
        "Hello! I am Fingent AI, your personal financial advisor. "
        "How can I help you with your finances today? "
        "You can ask about investments, savings, budgeting, or any financial topic.",
        voice='Polly.Joanna'
    )
    
    response.append(gather)
    
    # If no input, repeat
    response.say("I didn't catch that. Please try again.", voice='Polly.Joanna')
    response.redirect('/api/voice/welcome')
    
    return Response(content=str(response), media_type="application/xml")

@app.post("/api/voice/process")
async def voice_process(
    SpeechResult: Optional[str] = Form(None),
    CallSid: Optional[str] = Form(None)
):
    """Process user speech and generate AI response"""
    response = VoiceResponse()
    
    if not SpeechResult:
        response.say("I didn't hear anything. Let me transfer you back.", voice='Polly.Joanna')
        response.redirect('/api/voice/welcome')
        return Response(content=str(response), media_type="application/xml")
    
    # Get AI response from Groq
    try:
        if groq_client:
            financial_prompt = f"""You are Fingent AI, a voice-based financial advisor on a phone call. 
The user said: "{SpeechResult}"

Provide a clear, concise, and conversational response (2-3 sentences max) that:
- Sounds natural when spoken aloud
- Gives practical financial advice
- Is easy to understand over the phone

Keep it brief and friendly:"""
            
            ai_response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": financial_prompt}],
                temperature=0.7,
                max_tokens=256
            )
            
            advice = ai_response.choices[0].message.content.strip() if ai_response.choices else "I'm having trouble processing that right now."
        else:
            advice = "I'm currently unable to provide personalized advice. Please try the chat feature on our website."
        
        # Speak the AI response
        response.say(advice, voice='Polly.Joanna')
        
        # Ask for follow-up
        gather = Gather(
            input='speech',
            action='/api/voice/process',
            method='POST',
            speech_timeout='auto',
            language='en-US'
        )
        
        gather.say(
            "Do you have any other questions about your finances?",
            voice='Polly.Joanna'
        )
        
        response.append(gather)
        
        # End call option
        response.say("Thank you for using Fingent AI. Have a great day!", voice='Polly.Joanna')
        response.hangup()
        
    except Exception as e:
        print(f"Voice processing error: {e}")
        response.say(
            "I apologize, but I'm experiencing technical difficulties. Please visit our website for assistance.",
            voice='Polly.Joanna'
        )
        response.hangup()
    
    return Response(content=str(response), media_type="application/xml")

@app.post("/api/voice/goodbye")
async def voice_goodbye():
    """End call gracefully"""
    response = VoiceResponse()
    response.say(
        "Thank you for calling Fingent AI. We're here to help you achieve your financial goals. Goodbye!",
        voice='Polly.Joanna'
    )
    response.hangup()
    
    return Response(content=str(response), media_type="application/xml")

# ============ ROOT ENDPOINT ============
@app.get("/api")
async def root():
    """API root endpoint"""
    return {
        "name": "Fingent AI API",
        "version": "1.0.0",
        "status": "active",
        "groq_ready": groq_client is not None,
        "twilio_ready": twilio_client is not None,
        "endpoints": [
            "/api/health",
            "/api/chat",
            "/api/news",
            "/api/savings/advice",
            "/api/call",
            "/api/voice/welcome",
            "/api/voice/process",
            "/api/voice/goodbye"
        ]
    }

# ============ FALLBACK FOR SPA ============
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str):
    """Fallback for React SPA - return 404 for non-API paths"""
    if full_path.startswith("api/"):
        return JSONResponse(status_code=404, content={"error": "Endpoint not found"})
    return JSONResponse(status_code=404, content={"error": "Not found"})
