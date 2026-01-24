import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-primary opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-success opacity-10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-full mb-8"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Limited Time Offer</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Start Your Financial Journey
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Today for Free
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust Fingent AI for their
            financial decisions. Get started with a free account and unlock
            premium features.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
            >
              Create Free Account
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Schedule Demo
            </motion.button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
            No credit card required • Cancel anytime • 30-day money-back
            guarantee
          </p>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-12 border-t border-gray-200 dark:border-gray-800"
          >
            {[
              '256-bit SSL Encryption',
              'SOC 2 Certified',
              'GDPR Compliant',
              '99.9% Uptime',
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
