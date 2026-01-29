# Fingent AI - Smart Financial Decisions Made Easy

**AI-powered financial advisor platform built with React + FastAPI, optimized for Vercel serverless deployment**

[![Deployment](https://img.shields.io/badge/Deployment-Vercel%20Ready-00C9FF?style=flat-square)](https://vercel.com)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-15MB-success?style=flat-square)](OPTIMIZATION_REPORT.md)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=flat-square)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=flat-square)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 🎯 Quick Links

- 🚀 **[Deploy to Vercel](#-quick-deploy)** - One-click deployment
- 📖 **[Complete Deployment Guide](VERCEL_DEPLOYMENT.md)** - Full instructions
- 🔧 **[Setup Guide](DEPLOYMENT_GUIDE.md)** - Environment setup
- 📊 **[Optimization Report](OPTIMIZATION_REPORT.md)** - Technical deep-dive
- 📝 **[Deployment Summary](DEPLOYMENT_SUMMARY.txt)** - Visual overview

## ✨ Features

### AI Financial Advisor
- 🤖 **Gemini AI Integration** - Free unlimited AI responses
- 💬 **Smart Chat** - Ask any financial question
- 💡 **Personalized Advice** - Income-based savings recommendations
- 📊 **Financial News** - Real-time market updates

### Voice Integration
- 📞 **Phone Agent** - Call your AI advisor
- 🎤 **Twilio Integration** - Voice-enabled conversations
- 🔐 **Secure Calls** - Encrypted communication

### Modern UI/UX
- ⚡ **Vite + React** - Lightning-fast frontend
- 🎨 **Tailwind CSS** - Beautiful responsive design
- 🌙 **Dark Mode** - Eye-friendly interface
- ✨ **Smooth Animations** - Framer Motion effects

## 🚀 Quick Deploy

### Option 1: Deploy to Vercel (Recommended)

**One-Click Deploy:**
- Visit [vercel.com/new](https://vercel.com/new)
- Import this GitHub repository
- Add environment variables:
  - `GEMINI_API_KEY` - [Get here](https://makersuite.google.com/app/apikey)
  - `NEWS_API_KEY` - [Get here](https://newsapi.org)
  - `TWILIO_ACCOUNT_SID` - [Optional](https://www.twilio.com/console)
  - `TWILIO_AUTH_TOKEN` - [Optional](https://www.twilio.com/console)
- Click Deploy!

### Option 2: Deploy Locally

**Quick Start (Windows):**
```bash
setup.bat
```

**Quick Start (macOS/Linux):**
```bash
bash setup.sh
```

**Manual Setup:**
```bash
# Clone repository
git clone https://github.com/Abin-Biju-Offl/FINGENT-AI-.git
cd FINGENT-AI-

# Install backend dependencies
pip install -r requirements-vercel.txt

# Install frontend dependencies
cd frontend && npm install && cd ..

# Create .env file
echo GEMINI_API_KEY=your_key_here > .env
echo NEWS_API_KEY=your_key_here >> .env

# Start backend
python -m uvicorn api.index:app --port 3001 --reload

# In another terminal, start frontend
cd frontend && npm run dev
```

## 📋 Project Structure

```
fingent-ai/
├── api/
│   └── index.py                    # Serverless API (FastAPI)
│       ├── /api/health             # Health check
│       ├── /api/chat               # Gemini AI chat
│       ├── /api/news               # Financial news
│       ├── /api/savings/advice     # AI recommendations
│       └── /api/call               # Twilio integration
│
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── services/
│   │   │   └── api.ts              # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── dist/                       # Build output
│   ├── package.json
│   └── vite.config.ts
│
├── .env                            # Environment variables
├── .gitignore                      # Git ignore rules
├── requirements-vercel.txt         # Python dependencies
├── vercel.json                     # Vercel config
├── setup.sh / setup.bat            # Setup scripts
├── VERCEL_DEPLOYMENT.md            # Complete guide
├── DEPLOYMENT_GUIDE.md             # Step-by-step
├── DEPLOYMENT_SUMMARY.txt          # Visual overview
└── OPTIMIZATION_REPORT.md          # Technical details
```

## 🔧 Environment Variables

Create `.env` file:

```env
# Required
GEMINI_API_KEY=your_key_here          # Google Gemini API key
NEWS_API_KEY=your_key_here            # NewsAPI.org key

# Optional (for phone calls)
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
```

Get keys from:
- **Gemini:** https://makersuite.google.com/app/apikey (free)
- **NewsAPI:** https://newsapi.org (free tier)
- **Twilio:** https://www.twilio.com/console (pay-as-you-go)

## 📊 Performance & Optimization

### Bundle Size Reduction
- **Before:** 250MB+ ❌
- **After:** 15MB ✅
- **Reduction:** 94%

### Removed Dependencies
- ❌ `streamlit` (150MB) - Not needed for API
- ❌ `uvicorn` (50MB) - Vercel provides server
- ❌ Static file serving - Vercel handles frontend
- ❌ Jinja2 templates - React renders UI

### Kept (Essential)
- ✅ `google-generativeai` - AI core (3MB)
- ✅ `fastapi` - API framework (2MB)
- ✅ `requests` - HTTP client (2MB)
- ✅ `twilio` - Phone integration (2MB)

### Performance Metrics
| Metric | Value |
|--------|-------|
| Bundle Size | 15MB |
| Cold Start | 1-2s |
| Memory | ~100MB |
| Timeout | 30s |
| **Limit Status** | ✅ PASS |

## 🧪 API Endpoints

### Health Check
```bash
GET /api/health
```

### AI Chat
```bash
POST /api/chat
Content-Type: application/json

{
  "message": "How do I start investing?"
}
```

### Financial News
```bash
GET /api/news?category=crypto
# Categories: crypto, stocks, economy, real-estate, investing, all
```

### Savings Advice
```bash
POST /api/savings/advice
Content-Type: application/json

{
  "income": 5000,
  "expenses": 3000
}
```

### Phone Call
```bash
POST /api/call
Content-Type: application/json

{
  "phone_number": "+1234567890"
}
```

## 🚀 Deployment Checklist

- [ ] Get API keys (Gemini, NewsAPI, Twilio)
- [ ] Update `.env` with real keys
- [ ] Test locally (`npm run dev` + `python -m uvicorn`)
- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Test live endpoint (`/api/health`)
- [ ] Monitor logs in Vercel dashboard

## 📖 Documentation

1. **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** - Complete deployment guide
2. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Step-by-step setup
3. **[OPTIMIZATION_REPORT.md](OPTIMIZATION_REPORT.md)** - Technical details
4. **[DEPLOYMENT_SUMMARY.txt](DEPLOYMENT_SUMMARY.txt)** - Visual overview

## 🐛 Troubleshooting

### "Bundle size exceeded 250MB"
Already fixed! Bundle is now 15MB.

### "Gemini API not configured"
1. Get key from https://makersuite.google.com/app/apikey
2. Add to `.env` or Vercel dashboard
3. Restart application

### "CORS errors"
Handled by CORS middleware in `api/index.py`. Should work out of the box.

### "Cold start too slow"
Normal behavior (1-2s). Use keep-alive health checks for production.

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/Abin-Biju-Offl/FINGENT-AI-/issues)
- Documentation: See `VERCEL_DEPLOYMENT.md`
- Check logs: Vercel Dashboard > Your Project > Deployments > Logs

## 📝 License

MIT License - See LICENSE file

## 🙏 Credits

Built with:
- [React](https://react.dev) - Frontend framework
- [Vite](https://vitejs.dev) - Build tool
- [FastAPI](https://fastapi.tiangolo.com) - API framework
- [Google Gemini](https://deepmind.google/technologies/gemini) - AI engine
- [Vercel](https://vercel.com) - Deployment platform

---

**Made with ❤️ for financial empowerment**

[🌐 Live Demo](#) • [📖 Documentation](VERCEL_DEPLOYMENT.md) • [🚀 Deploy Now](#-quick-deploy)
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
