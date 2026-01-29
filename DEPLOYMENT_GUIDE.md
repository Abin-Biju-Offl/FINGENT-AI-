# Fingent AI - Deployment Guide

## 📋 Deployment Checklist

### 1. **Update Environment Variables in Vercel Dashboard**

Go to: `Settings > Environment Variables`

Add these:
```
GEMINI_API_KEY=your_gemini_key_here
NEWS_API_KEY=your_news_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
```

### 2. **Vercel CLI Deployment**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

### 3. **Project Structure**

```
fingent/
├── api/
│   └── index.py              # Serverless function (FastAPI)
├── frontend/
│   ├── src/
│   ├── dist/                 # Build output
│   └── package.json
├── .gitignore
├── vercel.json              # Deployment config
├── requirements-vercel.txt  # Python dependencies
└── README.md
```

### 4. **What Changed**

**Removed:**
- ❌ `streamlit` (not needed for serverless)
- ❌ `uvicorn` (Vercel handles it)
- ❌ Static file serving (Vercel serves frontend)
- ❌ Jinja2 templates (moved to React)

**Optimized:**
- ✅ Minimal Python dependencies (8 packages only)
- ✅ Single serverless handler (`api/index.py`)
- ✅ Direct API calls to external services
- ✅ No file I/O operations
- ✅ No background threading

### 5. **API Routes**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/chat` | POST | AI chat with Gemini |
| `/api/news` | GET | Financial news |
| `/api/savings/advice` | POST | Personalized advice |
| `/api/call` | POST | Phone call initiation |

### 6. **Bundle Size Optimization**

**Before:** ~250MB ❌
```
- streamlit: ~150MB
- uvicorn: ~50MB
- fastapi full: ~30MB
- dependencies: ~20MB
```

**After:** ~15MB ✅
```
- fastapi (slim): ~5MB
- google-generativeai: ~3MB
- requests: ~2MB
- other deps: ~5MB
```

### 7. **Testing Locally**

```bash
# Install dependencies
pip install -r requirements-vercel.txt

# Test the API
python -m uvicorn api.index:app --host 0.0.0.0 --port 3001

# Test endpoints
curl http://localhost:3001/api/health
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How do I start investing?"}'
```

### 8. **Production Considerations**

- **Cold Starts:** First request may take 3-5 seconds (AWS Lambda behavior)
- **Timeout:** Max 30 seconds per request (configure in `vercel.json`)
- **Memory:** 1024 MB allocated
- **Concurrency:** Auto-scaling handled by Vercel
- **Logging:** Check Vercel dashboard > Deployments > Logs

### 9. **Monitoring**

Monitor at: `https://your-domain.vercel.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-29T...",
  "gemini_ready": true
}
```

### 10. **Rollback**

If deployment fails:
```bash
vercel rollback
```

---

## 🚀 Next Steps

1. Update `.env` with real API keys
2. Test locally: `python -m uvicorn api.index:app`
3. Deploy: `vercel --prod`
4. Monitor: Check Vercel dashboard
5. Test endpoints: Use curl or Postman
