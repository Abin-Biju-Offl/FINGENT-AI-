import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';

const Statistics = () => {
  const stats = [
    {
      icon: Users,
      value: '50K+',
      label: 'Active Users',
      description: 'Trust our platform',
    },
    {
      icon: DollarSign,
      value: '$2.5B+',
      label: 'Assets Under Management',
      description: 'Secured & managed',
    },
    {
      icon: TrendingUp,
      value: '98.5%',
      label: 'Success Rate',
      description: 'Profitable trades',
    },
    {
      icon: Award,
      value: '24/7',
      label: 'Support Available',
      description: 'Always here to help',
    },
  ];

  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Thousands of Investors
          </h2>
          <p className="text-xl text-white/90">
            Join our growing community of successful investors
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="backdrop-blur-md bg-white/10 rounded-xl p-8 border border-white/20 text-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-white/80">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
