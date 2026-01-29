#!/bin/bash

# Fingent AI - Vercel Deployment Quick Start Script
# Run this script to set up everything for local development and Vercel deployment

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Fingent AI - Vercel Deployment Setup Script              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check Python
echo "✓ Checking Python installation..."
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.9+"
    exit 1
fi
PYTHON_VERSION=$(python --version | awk '{print $2}')
echo "  Python $PYTHON_VERSION found ✓"
echo ""

# Step 2: Create virtual environment (if not exists)
if [ ! -d ".venv" ]; then
    echo "✓ Creating Python virtual environment..."
    python -m venv .venv
    echo "  Virtual environment created ✓"
fi

# Step 3: Activate virtual environment
echo "✓ Activating virtual environment..."
source .venv/bin/activate
echo "  Virtual environment activated ✓"
echo ""

# Step 4: Install Python dependencies
echo "✓ Installing Python dependencies..."
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
pip install -r requirements-vercel.txt
echo "  Dependencies installed ✓"
echo ""

# Step 5: Install Node dependencies
echo "✓ Installing Node.js dependencies..."
cd frontend
npm install
cd ..
echo "  Frontend dependencies installed ✓"
echo ""

# Step 6: Create .env file if not exists
if [ ! -f ".env" ]; then
    echo "✓ Creating .env file..."
    cat > .env << 'EOF'
# Fingent AI Environment Variables
# Get these from:
# - Gemini: https://makersuite.google.com/app/apikey
# - NewsAPI: https://newsapi.org/
# - Twilio: https://www.twilio.com/console

GEMINI_API_KEY=your_gemini_key_here
NEWS_API_KEY=your_news_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
EOF
    echo "  .env file created ✓"
    echo "  ⚠️  Update .env with your actual API keys"
else
    echo "✓ .env file already exists"
fi
echo ""

# Step 7: Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not installed"
    echo "   Install with: npm install -g vercel"
else
    VERCEL_VERSION=$(vercel --version)
    echo "✓ Vercel CLI found: $VERCEL_VERSION"
fi
echo ""

# Step 8: Display next steps
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Setup Complete! Next Steps:                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Update .env with your API keys:"
echo "   • Gemini: https://makersuite.google.com/app/apikey"
echo "   • NewsAPI: https://newsapi.org/"
echo "   • Twilio: https://www.twilio.com/console (optional)"
echo ""
echo "2. Start development environment (3 terminals):"
echo ""
echo "   Terminal 1 - Backend API:"
echo "   $ python -m uvicorn api.index:app --port 3001 --reload"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   $ cd frontend && npm run dev"
echo ""
echo "   Terminal 3 - Test:"
echo "   $ curl http://localhost:3001/api/health"
echo ""
echo "3. Deploy to Vercel:"
echo "   $ vercel --prod"
echo ""
echo "4. Read documentation:"
echo "   • VERCEL_DEPLOYMENT.md - Complete guide"
echo "   • DEPLOYMENT_GUIDE.md - Step-by-step"
echo "   • OPTIMIZATION_REPORT.md - Technical details"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Happy Deploying! 🚀                                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
