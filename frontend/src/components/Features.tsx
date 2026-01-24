import { motion } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Bell,
  Globe,
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Portfolio Management',
      description:
        'AI-powered portfolio optimization with real-time rebalancing and risk management.',
      color: 'text-[#16a34a]',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description:
        'Deep insights into market trends, performance metrics, and predictive analysis.',
      color: 'text-blue-500',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description:
        '256-bit encryption, multi-factor authentication, and secure data storage.',
      color: 'text-[#D4AF37]',
    },
    {
      icon: Zap,
      title: 'Instant Execution',
      description:
        'Lightning-fast trade execution with real-time market data and price alerts.',
      color: 'text-yellow-500',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description:
        'Personalized alerts for price movements, news, and portfolio changes.',
      color: 'text-red-500',
    },
    {
      icon: Globe,
      title: 'Global Markets',
      description:
        'Access to stocks, crypto, forex, and commodities across global markets.',
      color: 'text-indigo-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-20 bg-[#111827] dark:bg-[#041f00]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] dark:text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
            Everything You Need to
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Succeed Financially
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Powerful tools and insights to help you make smarter financial
            decisions
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-8 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-lg bg-gradient-to-br from-${feature.color.split('-')[1]}-100 to-${feature.color.split('-')[1]}-200 dark:from-${feature.color.split('-')[1]}-900 dark:to-${feature.color.split('-')[1]}-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
