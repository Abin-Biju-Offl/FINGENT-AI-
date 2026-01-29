@echo off
REM Fingent AI - Vercel Deployment Quick Start Script (Windows)
REM Run this script to set up everything for local development and Vercel deployment

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Fingent AI - Vercel Deployment Setup Script (Windows)    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Check Python
echo ✓ Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.9+
    pause
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo   Python %PYTHON_VERSION% found ✓
echo.

REM Step 2: Create virtual environment
if not exist ".venv" (
    echo ✓ Creating Python virtual environment...
    python -m venv .venv
    echo   Virtual environment created ✓
)

REM Step 3: Activate virtual environment
echo ✓ Activating virtual environment...
call .venv\Scripts\activate.bat
echo   Virtual environment activated ✓
echo.

REM Step 4: Install Python dependencies
echo ✓ Installing Python dependencies...
pip install --upgrade pip setuptools wheel >nul 2>&1
pip install -r requirements-vercel.txt
echo   Dependencies installed ✓
echo.

REM Step 5: Install Node dependencies
echo ✓ Installing Node.js dependencies...
cd frontend
call npm install
cd ..
echo   Frontend dependencies installed ✓
echo.

REM Step 6: Create .env file if not exists
if not exist ".env" (
    echo ✓ Creating .env file...
    (
        echo # Fingent AI Environment Variables
        echo # Get these from:
        echo # - Gemini: https://makersuite.google.com/app/apikey
        echo # - NewsAPI: https://newsapi.org/
        echo # - Twilio: https://www.twilio.com/console
        echo.
        echo GEMINI_API_KEY=your_gemini_key_here
        echo NEWS_API_KEY=your_news_api_key_here
        echo TWILIO_ACCOUNT_SID=your_twilio_sid_here
        echo TWILIO_AUTH_TOKEN=your_twilio_token_here
    ) > .env
    echo   .env file created ✓
    echo   ⚠️  Update .env with your actual API keys
) else (
    echo ✓ .env file already exists
)
echo.

REM Step 7: Check Vercel CLI
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI not installed
    echo    Install with: npm install -g vercel
) else (
    for /f "tokens=*" %%i in ('vercel --version 2^>^&1') do set VERCEL_VERSION=%%i
    echo ✓ Vercel CLI found: !VERCEL_VERSION!
)
echo.

REM Step 8: Display next steps
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Setup Complete! Next Steps:                              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 1. Update .env with your API keys:
echo    • Gemini: https://makersuite.google.com/app/apikey
echo    • NewsAPI: https://newsapi.org/
echo    • Twilio: https://www.twilio.com/console (optional)
echo.
echo 2. Start development environment (3 terminals):
echo.
echo    Terminal 1 - Backend API:
echo    $ python -m uvicorn api.index:app --port 3001 --reload
echo.
echo    Terminal 2 - Frontend:
echo    $ cd frontend ^&^& npm run dev
echo.
echo    Terminal 3 - Test:
echo    $ curl http://localhost:3001/api/health
echo.
echo 3. Deploy to Vercel:
echo    $ vercel --prod
echo.
echo 4. Read documentation:
echo    • VERCEL_DEPLOYMENT.md - Complete guide
echo    • DEPLOYMENT_GUIDE.md - Step-by-step
echo    • OPTIMIZATION_REPORT.md - Technical details
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Happy Deploying! 🚀                                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
