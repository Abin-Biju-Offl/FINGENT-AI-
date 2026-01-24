import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TalkToAgent from './components/TalkToAgent';
import LiveMarkets from './components/LiveMarkets';
import FinancialTools from './components/FinancialTools';
import NewsSection from './components/NewsSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChat from './components/AIChat';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main>
        <Hero />
        <LiveMarkets />
        <FinancialTools />
        <NewsSection />
        <Contact />
        <TalkToAgent />
      </main>

      <Footer />

      {/* AI Chat Modal */}
      <AIChat isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChat(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-primary rounded-full shadow-2xl flex items-center justify-center text-white text-2xl z-50"
      >
        💬
      </motion.button>
    </div>
  );
}

export default App;
