import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calculator, PiggyBank, TrendingUp } from 'lucide-react';
import { apiService } from '../services/api';

const FinancialTools = () => {
  const [activeTab, setActiveTab] = useState<'savings' | 'investment' | 'retirement'>('savings');
  
  // Savings state
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  // Investment ROI state
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [years, setYears] = useState('');
  const [returnRate, setReturnRate] = useState('');
  const [roiResult, setRoiResult] = useState<{
    totalInvested: number;
    totalValue: number;
    totalReturn: number;
    roi: number;
  } | null>(null);

  // Retirement state
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyRetirement, setMonthlyRetirement] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [retirementResult, setRetirementResult] = useState<{
    yearsToRetirement: number;
    monthlySavingsNeeded: number;
    totalNeeded: number;
    projected: number;
  } | null>(null);

  const handleGetAdvice = async () => {
    if (!income || !expenses) return;
    
    setLoading(true);
    try {
      const response = await apiService.getSavingsAdvice(
        parseFloat(income),
        parseFloat(expenses)
      );
      setAdvice(response.advice);
    } catch (error) {
      console.error('Error getting advice:', error);
      setAdvice('Unable to get advice at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const time = parseFloat(years) || 0;
    const rate = parseFloat(returnRate) / 100 || 0;

    const months = time * 12;
    const monthlyRate = rate / 12;

    // Future value of initial investment
    const futureInitial = initial * Math.pow(1 + rate, time);

    // Future value of monthly contributions (annuity)
    let futureMonthly = 0;
    if (monthlyRate > 0) {
      futureMonthly = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
      futureMonthly = monthly * months;
    }

    const totalValue = futureInitial + futureMonthly;
    const totalInvested = initial + (monthly * months);
    const totalReturn = totalValue - totalInvested;
    const roi = ((totalReturn / totalInvested) * 100);

    setRoiResult({
      totalInvested,
      totalValue,
      totalReturn,
      roi
    });
  };

  const calculateRetirement = () => {
    const age = parseFloat(currentAge) || 0;
    const retAge = parseFloat(retirementAge) || 0;
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyRetirement) || 0;
    const rate = parseFloat(expectedReturn) / 100 || 0;

    const yearsToRet = retAge - age;
    const monthsToRet = yearsToRet * 12;
    const monthlyRate = rate / 12;

    // Future value of current savings
    const futureSavings = savings * Math.pow(1 + rate, yearsToRet);

    // Future value of monthly contributions
    let futureMonthly = 0;
    if (monthlyRate > 0) {
      futureMonthly = monthly * ((Math.pow(1 + monthlyRate, monthsToRet) - 1) / monthlyRate);
    } else {
      futureMonthly = monthly * monthsToRet;
    }

    const projected = futureSavings + futureMonthly;
    
    // Estimate needed (25x annual expenses rule)
    const totalNeeded = monthly * 12 * 25;
    const shortfall = totalNeeded - projected;
    const monthlySavingsNeeded = shortfall > 0 ? (shortfall / monthsToRet) : 0;

    setRetirementResult({
      yearsToRetirement: yearsToRet,
      monthlySavingsNeeded,
      totalNeeded,
      projected
    });
  };

  const tabs = [
    { id: 'savings', label: 'Savings Calculator', icon: PiggyBank },
    { id: 'investment', label: 'Investment ROI', icon: TrendingUp },
    { id: 'retirement', label: 'Retirement Planner', icon: Calculator },
  ];

  return (
    <section id="tools" className="py-20 bg-[#111827] dark:bg-[#041f00]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#D4AF37] dark:text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">
            Financial Tools
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
            Plan Your Financial Future
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
            Use our calculators to make informed financial decisions
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 gap-4 flex-wrap">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Savings Calculator */}
        {activeTab === 'savings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get AI-Powered Savings Advice
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Income ($)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Expenses ($)
                  </label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="3000"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetAdvice}
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Getting Advice...' : 'Get AI Advice'}
                </motion.button>

                {advice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-l-4 border-primary-500"
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      AI Recommendation
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {advice}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Investment ROI Calculator */}
        {activeTab === 'investment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Investment Return Calculator
              </h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Initial Investment ($)
                    </label>
                    <input
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Contribution ($)
                    </label>
                    <input
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Investment Period (Years)
                    </label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expected Return (% per year)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={returnRate}
                      onChange={(e) => setReturnRate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="7"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateROI}
                  className="w-full btn-primary"
                >
                  Calculate ROI
                </motion.button>

                {roiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 grid md:grid-cols-2 gap-4"
                  >
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Invested</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${roiResult.totalInvested.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Future Value</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${roiResult.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Return</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${roiResult.totalReturn.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="p-4 bg-[#FAF7F0] dark:bg-[#16a34a]/20 rounded-lg border-2 border-[#D4AF37]">
                      <div className="text-sm text-gray-600 dark:text-gray-400">ROI</div>
                      <div className="text-2xl font-bold text-[#D4AF37] dark:text-[#D4AF37]">
                        {roiResult.roi.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Retirement Planner */}
        {activeTab === 'retirement' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Retirement Planning Calculator
              </h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Age
                    </label>
                    <input
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Retirement Age
                    </label>
                    <input
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="65"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Savings ($)
                    </label>
                    <input
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Savings ($)
                    </label>
                    <input
                      type="number"
                      value={monthlyRetirement}
                      onChange={(e) => setMonthlyRetirement(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Annual Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="7"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateRetirement}
                  className="w-full btn-primary"
                >
                  Calculate Retirement Plan
                </motion.button>

                {retirementResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Years to Retirement
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {retirementResult.yearsToRetirement} years
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Projected Savings</div>
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          ${retirementResult.projected.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Recommended Goal</div>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ${retirementResult.totalNeeded.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>

                    {retirementResult.monthlySavingsNeeded > 0 && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Additional Monthly Savings Needed
                        </div>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          ${retirementResult.monthlySavingsNeeded.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          To reach your retirement goal, consider increasing your monthly savings.
                        </p>
                      </div>
                    )}

                    {retirementResult.monthlySavingsNeeded <= 0 && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ✅ You're on track!
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Your current savings plan should help you reach your retirement goals.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FinancialTools;
