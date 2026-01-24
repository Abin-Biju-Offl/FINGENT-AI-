# Fingent AI - FastAPI Financial Advisor

A modern financial advisory platform built with **FastAPI**, featuring AI-powered assistance, real-time news with images, personalized savings advice, and voice calling capabilities.

## 🚀 Features

### Main Website (FastAPI - Port 8000)
- ✅ **Background color**: #f8ebff (soft lavender purple)
- ✅ **Accent color**: #caff00 (bright yellow-green)
- 📰 **Latest Financial News** with images and categories
  - Real-time news from December 2025
  - Filter by: Crypto, Economy, Stocks, Markets, Investing, Real Estate
  - Professional news images from Unsplash
  - Source attribution for credibility
- 💰 **Personalized Savings Advice** by country and age group
- 💬 **AI Chat Assistant** for instant financial guidance
- 📞 **"Talk to Agent" Button** launches full voice-enabled agent

### Full AI Agent (Streamlit - Port 8501)
- 📞 Voice call capabilities via Twilio
- 💬 Advanced chat features
- 📊 Comprehensive financial analysis
- 🔧 MCP integration for real calls

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## 🔧 Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install fastapi uvicorn python-multipart jinja2 python-dotenv pydantic aiofiles twilio streamlit
```

### 2. Set Up Environment Variables (Optional)

Create a `.env` file in the project root:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
```

## ▶️ Running the Application

### Option 1: Run FastAPI Server (Recommended)

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Then open your browser: **http://localhost:8000**

### Option 2: Run Streamlit Agent Directly

```bash
streamlit run fingent_ai_working.py
```

Then open: **http://localhost:8501**

## 🎯 Using the Application

### Main Website Navigation

1. **Home** - Landing page with overview
2. **News** - Latest financial news with category filters
   - Click category buttons to filter news
   - View images, sources, and dates
3. **Savings** - Personalized financial advice
   - Select country, state, and age group
   - Get customized recommendations
4. **AI Assistant** - Chat interface
   - Click "Talk to Agent" to launch full agent
   - Quick chat for basic questions

### API Endpoints

FastAPI provides interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

#### Available Endpoints:

```
GET  /                          - Main web interface
GET  /launch-agent              - Launch Streamlit agent
GET  /api/news                  - Get financial news (with optional category filter)
GET  /api/news/categories       - Get available news categories
POST /api/chat                  - Chat with AI assistant
POST /api/call                  - Make voice call
POST /api/savings/advice        - Get personalized savings advice
```

#### Example API Usage:

**Get all news:**
```bash
curl http://localhost:8000/api/news
```

**Get crypto news only:**
```bash
curl http://localhost:8000/api/news?category=Crypto
```

**Get news categories:**
```bash
curl http://localhost:8000/api/news/categories
```

**Chat with AI:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I start investing?"}'
```

## 🎨 Design System

### Colors
- **Primary Background**: `#f8ebff` (soft lavender)
- **Accent/Highlight**: `#caff00` (bright yellow-green)
- **Text Dark**: `#2d2d2d`
- **Text Light**: `#666666`
- **Card Background**: `#ffffff`

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

## 📰 News Section Features

### Categories Available:
- 🌐 All News
- ₿ Crypto
- 📈 Economy
- 📊 Stocks
- 🏛️ Markets
- 💼 Investing
- 🏠 Real Estate

### News Data Includes:
- Title and description
- Professional images (via Unsplash)
- Publication date (current to December 2025)
- News source attribution
- Category badges

## 🔄 Migration from Flask to FastAPI

### Key Changes:

1. **Framework**: Flask → FastAPI
2. **Server**: Werkzeug → Uvicorn
3. **Port**: 5000 → 8000 (default)
4. **Decorators**: `@app.route()` → `@app.get()/@app.post()`
5. **Request Handling**: `request.get_json()` → Pydantic models
6. **Response**: `jsonify()` → Direct return (auto-serialized)

### Benefits:
- ⚡ **Faster**: Built on ASGI (async)
- 📝 **Auto Documentation**: Swagger UI and ReDoc included
- ✅ **Type Safety**: Pydantic validation
- 🔧 **Modern**: Python 3.8+ features

## 🐛 Troubleshooting

### Port Already in Use

**FastAPI (8000):**
```bash
uvicorn main:app --port 8001
```

**Streamlit (8501):**
```bash
streamlit run fingent_ai_working.py --server.port 8502
```

### "Talk to Agent" Button Issues

1. Ensure Streamlit is installed: `pip install streamlit`
2. Check port 8501 availability
3. Manually navigate to http://localhost:8501 if auto-launch fails

### Import Errors

```bash
pip install --upgrade -r requirements.txt
```

### Module Not Found

Make sure you're in the project directory:
```bash
cd e:\WORK\Projects\fingent
python main.py
```

## 📁 Project Structure

```
fingent/
├── main.py                     # FastAPI application (main entry)
├── app.py                      # Old Flask version (deprecated)
├── fingent_ai_working.py       # Streamlit AI agent
├── requirements.txt            # Python dependencies
├── templates/
│   └── index.html             # Main HTML template
├── static/
│   ├── css/
│   │   └── styles.css         # Styling
│   └── js/
│       └── script.js          # JavaScript functionality
└── README.md                  # This file
```

## 🚀 Deployment

### Local Development
```bash
python main.py
```

### Production (with Gunicorn)
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 Notes

- **News images** are loaded from Unsplash API
- **Date formatting** shows current December 2025 dates
- **Categories** are filterable via buttons or API
- **Responsive design** works on all devices
- **FastAPI** provides automatic API documentation

## 🤝 Support

For issues or questions:
1. Check API docs at `/docs`
2. Review console logs in browser
3. Check terminal for server errors

---

**Enjoy using Fingent AI with FastAPI! 💰🚀**

*Version 2.0 - FastAPI Edition - December 2025*
