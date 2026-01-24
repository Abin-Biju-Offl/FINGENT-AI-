import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, DollarSign, BarChart3, Target } from 'lucide-react';

const PortfolioTracker = () => {
  const portfolioData = [
    { name: 'Stocks', value: 45, color: '#111111' },
    { name: 'Crypto', value: 25, color: '#16a34a' },
    { name: 'Bonds', value: 20, color: '#16a34a' },
    { name: 'Cash', value: 10, color: '#f59e0b' },
  ];

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Value',
      value: '$124,580',
      change: '+12.5%',
      positive: true,
    },
    {
      icon: TrendingUp,
      label: 'Total Gain',
      value: '$18,432',
      change: '+23.4%',
      positive: true,
    },
    {
      icon: BarChart3,
      label: 'Best Performer',
      value: 'TSLA',
      change: '+45.2%',
      positive: true,
    },
    {
      icon: Target,
      label: 'Goal Progress',
      value: '67%',
      change: 'On track',
      positive: true,
    },
  ];

  return (
    <section id="portfolio" className="py-20 bg-[#111827] dark:bg-[#041f00]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#D4AF37] dark:text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
            Track Your Investments
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
            Real-time portfolio monitoring with detailed analytics
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Asset Allocation
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {portfolioData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {item.value}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center mb-4`}
                >
                  <stat.icon className="w-6 h-6 text-[#D4AF37] dark:text-[#D4AF37]" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    stat.positive ? 'text-[#16a34a]' : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioTracker;
