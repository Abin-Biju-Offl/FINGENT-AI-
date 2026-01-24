# Fingent AI - Professional Financial Advisory Platform

A modern, professional financial advisory web application built with React, TypeScript, Framer Motion, GSAP, and FastAPI.

## 🚀 Features

- **AI-Powered Chat**: Intelligent financial advice using Google Gemini Pro
- **Real-Time Market Data**: Live price updates for stocks, crypto, and more
- **Portfolio Tracker**: Visualize and track your investments
- **Financial Tools**: Savings calculator, investment ROI, retirement planner
- **Live News Feed**: Real-time financial news from NewsAPI
- **Beautiful Animations**: Smooth transitions with Framer Motion and GSAP
- **Dark Mode**: Fully responsive with light/dark theme support
- **Professional Design**: Modern gradient-based color scheme

## 🛠️ Tech Stack

### Frontend
- React 18.2 with TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- GSAP (Advanced animations)
- Recharts (Data visualization)
- Axios (HTTP client)
- Lucide React (Icons)

### Backend
- FastAPI (Python web framework)
- Google Gemini Pro (AI/LLM)
- NewsAPI (Financial news)
- Twilio (Voice calls)
- Uvicorn (ASGI server)

## 📦 Installation

### Backend Setup

1. Install Python dependencies (from root directory):
```bash
E:/WORK/Projects/fingent/.venv/Scripts/python.exe -m pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
```env
GEMINI_API_KEY=your_gemini_key_here
NEWS_API_KEY=your_news_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

3. Start the FastAPI backend:
```bash
E:/WORK/Projects/fingent/.venv/Scripts/python.exe app.py
```

Backend will run on: http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install npm dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on: http://localhost:3000

## 🎨 Color Theme

The application uses a professional gradient-based color scheme:

- **Primary**: Blue (#667eea) to Purple (#764ba2) gradient
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔧 Development

### Available Scripts (Frontend)

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── LiveMarkets.tsx
│   │   ├── FinancialTools.tsx
│   │   ├── NewsSection.tsx
│   │   ├── PortfolioTracker.tsx
│   │   ├── Statistics.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTASection.tsx
│   │   ├── Footer.tsx
│   │   └── AIChat.tsx
│   ├── services/       # API services
│   │   └── api.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## 🔌 API Endpoints

### FastAPI Backend Endpoints

- `GET /api/news?category={category}` - Get financial news
- `POST /api/chat` - Send message to AI advisor
- `POST /api/savings/advice` - Get savings advice
- `POST /api/call` - Make phone call via Twilio
- `GET /launch-agent` - Launch Streamlit agent

## 🌟 Features in Detail

### AI Chat
- Real-time conversation with AI financial advisor
- Powered by Google Gemini Pro
- Context-aware responses
- Chat history

### Live Markets
- Real-time price updates
- Support for stocks, crypto, forex
- Visual price change indicators
- Percentage change tracking

### Portfolio Tracker
- Interactive pie chart visualization
- Asset allocation breakdown
- Performance metrics
- Goal progress tracking

### Financial Tools
- **Savings Calculator**: Get AI-powered savings advice
- **Investment ROI**: Calculate potential returns
- **Retirement Planner**: Plan for retirement

### News Feed
- Category filtering (Crypto, Stocks, Markets, Economy)
- Real-time updates from NewsAPI
- Article images and summaries
- External links to full articles

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting provider

### Backend Deployment (Railway/Render/Heroku)

1. Ensure all environment variables are set
2. Deploy the root directory (contains app.py)
3. Set Python version to 3.13+
4. Install requirements from requirements.txt

## 🔐 Security

- API keys stored in environment variables
- HTTPS recommended for production
- Input validation on all forms
- XSS protection with React
- CORS configured properly

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@fingentai.com or join our Discord server.

## 🙏 Acknowledgments

- Google Gemini Pro for AI capabilities
- NewsAPI for financial news
- Framer Motion for smooth animations
- Recharts for beautiful charts
- Tailwind CSS for utility-first styling
