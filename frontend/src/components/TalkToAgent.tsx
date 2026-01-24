import { motion } from 'framer-motion';
import { MessageSquare, Phone, Zap, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import PhoneAgent from './PhoneAgent';

const TalkToAgent = () => {
  const [showPhoneAgent, setShowPhoneAgent] = useState(false);

  return (
    <>
    <section id="agent" className="min-h-screen flex justify-center pt-12 bg-[#111827] dark:bg-[#041f00]">
      <div className="w-full max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#D4AF37] dark:text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">
            AI Assistant
          </span>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-[#D4AF37] mt-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Talk to Our Financial Agent
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400 mt-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get instant financial guidance powered by advanced AI
          </motion.p>
        </motion.div>

        <div>
          {/* Centered CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center w-full"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <MessageSquare className="w-16 h-16 text-white" />
            </div>

            <h3 className="text-3xl font-bold text-[#111111] dark:text-white mb-4">
              Start Your Conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Connect with our AI financial agent and get expert advice tailored to your needs.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPhoneAgent(true)}
              className="group btn-primary px-8 py-4 text-[#111111] rounded-lg font-bold text-lg flex items-center gap-3 mx-auto"
            >
              <Phone className="w-6 h-6" />
              Talk to Agent Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Features Grid - Centered Below */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6 mt-8 w-full"
          >
            <div className="glass-card p-6 hover:shadow-xl transition-all">
              <MessageSquare className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold text-[#111111] dark:text-white mb-2">
                24/7 AI Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant answers to your financial questions anytime, anywhere.
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl transition-all">
              <Phone className="w-12 h-12 text-[#16a34a] mb-4" />
              <h3 className="text-xl font-bold text-[#111111] dark:text-white mb-2">
                Voice-Enabled
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Talk naturally with our AI agent using voice commands.
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl transition-all">
              <Zap className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold text-[#111111] dark:text-white mb-2">
                Instant Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive personalized financial advice in real-time.
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl transition-all">
              <Shield className="w-12 h-12 text-[#16a34a] mb-4" />
              <h3 className="text-xl font-bold text-[#111111] dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your conversations are encrypted and completely confidential.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    
    {/* Phone Agent Modal */}
    <PhoneAgent isOpen={showPhoneAgent} onClose={() => setShowPhoneAgent(false)} />
    </>
  );
};

export default TalkToAgent;
