import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import PhoneAgent from './PhoneAgent';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showPhoneAgent, setShowPhoneAgent] = useState(false);

  const financialQuotes = [
    {
      icon: TrendingUp,
      iconColor: 'text-[#16a34a]',
      title: 'Portfolio Growth',
      quote: '"An investment in knowledge pays the best interest." - Benjamin Franklin'
    },
    {
      icon: Shield,
      iconColor: 'text-blue-500',
      title: 'Secure & Protected',
      quote: '"Risk comes from not knowing what you\'re doing." - Warren Buffett'
    },
    {
      icon: Zap,
      iconColor: 'text-yellow-500',
      title: 'Instant Insights',
      quote: '"The stock market is filled with individuals who know the price of everything, but the value of nothing." - Philip Fisher'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % financialQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll('.hero-float'), {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.to(heroRef.current.querySelectorAll('.hero-float-anim'), {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.3,
      });
    }
  }, []);

  const words1 = ['Smart', 'Financial'];
  const words2 = ['Decisions', 'Made', 'Easy'];

  return (
    <>
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#192b20] to-[#16a34a]">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#B8860B] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-float"
            >
              <span className="inline-block px-4 py-2 bg-[#B8860B] text-[#111111] rounded-full text-sm font-semibold mb-4 shadow-lg">
                AI-Powered Financial Advisory
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                {words1.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.3 }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                <span className="text-gradient-gold">
                  Decisions Made Easy
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-float text-xl text-gray-300 leading-relaxed"
            >
              Harness the power of AI to optimize your investments, track your portfolio, and make informed financial decisions with real-time insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hero-float flex flex-wrap gap-4"
            >
              <button 
                onClick={() => setShowPhoneAgent(true)}
                className="group btn-primary flex items-center gap-2 font-bold">
                Talk to Agent
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Stats - Removed per requirement */}
          </div>

          {/* Right Content - Financial Quotes Floating Cards */}
          <div className="relative h-[600px] hidden md:block">
            <motion.div
              key={`quote-0-${currentQuoteIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: currentQuoteIndex === 0 ? 1 : 0.3, 
                y: [0, -20, 0]
              }}
              transition={{ 
                opacity: { duration: 0.8 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-0 right-0 glass-card p-6 w-64"
            >
              <p className="text-gray-200 text-sm italic font-semibold leading-relaxed">
                {financialQuotes[currentQuoteIndex === 0 ? 0 : (currentQuoteIndex + 2) % 3].quote}
              </p>
            </motion.div>

            <motion.div
              key={`quote-1-${currentQuoteIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: currentQuoteIndex === 1 ? 1 : 0.3, 
                y: [0, -20, 0]
              }}
              transition={{ 
                opacity: { duration: 0.8 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
              className="absolute top-40 left-0 glass-card p-6 w-64"
            >
              <p className="text-gray-200 text-sm italic font-semibold leading-relaxed">
                {financialQuotes[(currentQuoteIndex + 1) % 3].quote}
              </p>
            </motion.div>

            <motion.div
              key={`quote-2-${currentQuoteIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: currentQuoteIndex === 2 ? 1 : 0.3, 
                y: [0, -20, 0]
              }}
              transition={{ 
                opacity: { duration: 0.8 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="absolute bottom-0 right-12 glass-card p-6 w-64"
            >
              <p className="text-gray-200 text-sm italic font-semibold leading-relaxed">
                {financialQuotes[(currentQuoteIndex + 2) % 3].quote}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    
    {/* Phone Agent Modal */}
    <PhoneAgent isOpen={showPhoneAgent} onClose={() => setShowPhoneAgent(false)} />
    </>
  );
};

export default Hero;
