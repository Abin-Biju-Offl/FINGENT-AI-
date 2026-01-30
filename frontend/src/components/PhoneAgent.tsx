import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Phone, X, CheckCircle, AlertCircle, TrendingUp, Briefcase, DollarSign, PiggyBank } from 'lucide-react';
import { apiService } from '../services/api';

interface PhoneAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CallResult {
  status: string;
  message?: string;
  call_sid?: string;
  to_number?: string;
  timestamp?: string;
  details?: string;
}

const PhoneAgent = ({ isOpen, onClose }: PhoneAgentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [callResult, setCallResult] = useState<CallResult | null>(null);
  const [validationError, setValidationError] = useState('');

  const validatePhoneNumber = (phone: string): { valid: boolean; message: string } => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    if (!cleaned.startsWith('+')) {
      return { valid: false, message: 'Phone number must start with + (e.g., +1XXXXXXXXXX)' };
    }
    
    const digitsOnly = cleaned.slice(1);
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return { valid: false, message: 'Phone number must have 10-15 digits after the +' };
    }
    
    return { valid: true, message: cleaned };
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setValidationError('');
    setCallResult(null);
  };

  const handleMakeCall = async () => {
    const validation = validatePhoneNumber(phoneNumber);
    
    if (!validation.valid) {
      setValidationError(validation.message);
      return;
    }
    
    setLoading(true);
    setCallResult(null);
    
    try {
      const result = await apiService.makePhoneCall(validation.message);
      setCallResult(result);
      
      if (result.status === 'success') {
        setTimeout(() => {
          setPhoneNumber('');
          setCallResult(null);
        }, 5000);
      }
    } catch (error: any) {
      setCallResult({
        status: 'error',
        message: error.response?.data?.message || 'Failed to make call. Please try again.',
        details: error.response?.data?.details || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Market Updates',
      description: 'Latest financial news and market trends'
    },
    {
      icon: Briefcase,
      title: 'Trading Insights',
      description: 'Trading strategies and opportunities'
    },
    {
      icon: PiggyBank,
      title: 'Investment Tips',
      description: 'Portfolio management and schemes'
    },
    {
      icon: DollarSign,
      title: 'Tax Savings',
      description: 'Tax-saving tips and financial planning'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto glass-card shadow-2xl z-50 rounded-2xl mx-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#111111] to-[#16a34a] p-4 sm:p-6 rounded-t-2xl border-b border-[#16a34a]/20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                    <Phone className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                    <span className="truncate">Talk to Fingent AI Agent</span>
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 mt-1 sm:mt-2 line-clamp-1">Your professional financial advisor via phone call</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left: Phone Input */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-br from-[#16a34a]/10 to-[#16a34a]/5 p-4 sm:p-6 rounded-xl border border-[#16a34a]/20">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">📞 Make Outbound Call</h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                      Enter your phone number to receive a call from our AI financial advisor
                    </p>

                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                          Phone Number (International Format)
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="+1XXXXXXXXXX, +44XXXXXXXXXX, +91XXXXXXXXXX"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                        />
                        {validationError && (
                          <div className="flex items-center gap-2 mt-2 text-red-400">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{validationError}</span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleMakeCall}
                        disabled={loading || !phoneNumber}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-3"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Initiating Call...
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            Make Call
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Call Result */}
                    {callResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border-l-4 ${
                          callResult.status === 'success'
                            ? 'bg-green-900/20 border-green-500'
                            : 'bg-red-900/20 border-red-500'
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          {callResult.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                              {callResult.status === 'success' ? '🎉 Call Initiated!' : '❌ Call Failed'}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-300 mb-2 break-words">{callResult.message}</p>
                            {callResult.call_sid && (
                              <p className="text-xs text-gray-400 break-all">Call SID: {callResult.call_sid}</p>
                            )}
                            {callResult.details && (
                              <div 
                                className="mt-2 text-xs sm:text-sm text-gray-300"
                                dangerouslySetInnerHTML={{ __html: callResult.details }}
                              />
                            )}
                          </div>
                        </div>
                        
                        {callResult.status === 'success' && (
                          <div className="mt-3 sm:mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                            <p className="text-xs sm:text-sm text-gray-300">
                              <strong className="text-white">What happens next:</strong>
                            </p>
                            <ul className="text-xs sm:text-sm text-gray-300 mt-2 space-y-1 ml-4 list-disc">
                              <li>The call is connecting to your phone</li>
                              <li>When you answer, Fingent AI will introduce itself</li>
                              <li>The agent will provide financial updates and insights</li>
                              <li>Conversation can last up to 10 minutes</li>
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Agent Info */}
                  <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 p-4 sm:p-6 rounded-xl border border-[#D4AF37]/20">
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">🤖 Agent Details</h4>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white font-semibold text-right">Fingent AI</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-400">Voice:</span>
                        <span className="text-white font-semibold text-right">Professional Male</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-400">Specialty:</span>
                        <span className="text-white font-semibold text-right">Financial Advisory</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-400">Language:</span>
                        <span className="text-white font-semibold text-right">English</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Features */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">🎯 Agent Features</h3>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700 hover:border-[#16a34a]/50 transition-colors"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#16a34a] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-white mb-1">{feature.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Info Box */}
                  <div className="bg-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-500/30 mt-4 sm:mt-6">
                    <h4 className="text-sm sm:text-base font-bold text-blue-300 mb-2">💡 How It Works</h4>
                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1 ml-4 list-disc">
                      <li>Enter your phone number in international format</li>
                      <li>Click "Make Call" to initiate the connection</li>
                      <li>Answer the incoming call from Fingent AI</li>
                      <li>Discuss your financial questions and get expert advice</li>
                      <li>The agent uses real-time data and AI analysis</li>
                    </ul>
                  </div>

                  {/* Verification Notice */}
                  <div className="bg-yellow-900/20 p-3 sm:p-4 rounded-lg border border-yellow-500/30">
                    <h4 className="text-sm sm:text-base font-bold text-yellow-300 mb-2">⚠️ Important Notice</h4>
                    <p className="text-xs sm:text-sm text-gray-300">
                      This service uses Twilio for phone calls. During trial mode, only verified phone numbers 
                      can receive calls. For unrestricted calling, upgrade to a paid account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 bg-gray-900/50 rounded-b-2xl border-t border-gray-800">
              <p className="text-center text-xs sm:text-sm text-gray-400">
                💰 Fingent AI - Professional Financial Advisory Service powered by AI
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PhoneAgent;
