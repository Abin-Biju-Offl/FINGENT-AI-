import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  logo: string;
}

const LiveMarkets = () => {
  const [markets, setMarkets] = useState<MarketData[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 65432.21, change: 1234.56, changePercent: 1.92, volume: '28.5B', marketCap: '1.28T', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { symbol: 'ETH', name: 'Ethereum', price: 3542.89, change: -45.23, changePercent: -1.26, volume: '15.2B', marketCap: '425B', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.34, changePercent: 1.33, volume: '52.3M', marketCap: '2.8T', logo: 'https://logo.clearbit.com/apple.com' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.67, change: 0.89, changePercent: 0.63, volume: '25.1M', marketCap: '1.8T', logo: 'https://logo.clearbit.com/google.com' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -3.45, changePercent: -1.40, volume: '120M', marketCap: '770B', logo: 'https://logo.clearbit.com/tesla.com' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.23, change: 5.67, changePercent: 1.39, volume: '28.4M', marketCap: '3.1T', logo: 'https://logo.clearbit.com/microsoft.com' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.92, change: 3.21, changePercent: 1.83, volume: '45.2M', marketCap: '1.85T', logo: 'https://logo.clearbit.com/amazon.com' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.43, change: 12.34, changePercent: 1.43, volume: '38.5M', marketCap: '2.15T', logo: 'https://logo.clearbit.com/nvidia.com' },
    { symbol: 'META', name: 'Meta Platforms', price: 489.34, change: -5.67, changePercent: -1.15, volume: '18.7M', marketCap: '1.24T', logo: 'https://logo.clearbit.com/meta.com' },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.76, change: 1.45, changePercent: 0.73, volume: '12.3M', marketCap: '580B', logo: 'https://logo.clearbit.com/jpmorganchase.com' },
    { symbol: 'V', name: 'Visa Inc.', price: 278.91, change: 2.87, changePercent: 1.04, volume: '8.5M', marketCap: '590B', logo: 'https://logo.clearbit.com/visa.com' },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 165.43, change: -0.89, changePercent: -0.54, volume: '9.2M', marketCap: '450B', logo: 'https://logo.clearbit.com/walmart.com' },
    { symbol: 'DIS', name: 'Walt Disney Co.', price: 112.34, change: 1.56, changePercent: 1.41, volume: '11.4M', marketCap: '205B', logo: 'https://logo.clearbit.com/disney.com' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 612.45, change: 8.23, changePercent: 1.36, volume: '5.8M', marketCap: '265B', logo: 'https://logo.clearbit.com/netflix.com' },
    { symbol: 'BA', name: 'Boeing Co.', price: 187.65, change: -2.34, changePercent: -1.23, volume: '7.6M', marketCap: '115B', logo: 'https://logo.clearbit.com/boeing.com' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState<MarketData[]>(markets);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((market) => {
          const changeAmount = (Math.random() - 0.5) * 10;
          const newPrice = market.price + changeAmount;
          const newChange = market.change + changeAmount;
          const newChangePercent = (newChange / market.price) * 100;
          return {
            ...market,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Filter markets based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMarkets(markets);
    } else {
      const filtered = markets.filter(
        (market) =>
          market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          market.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMarkets(filtered);
    }
  }, [searchTerm, markets]);

  return (
    <section id="markets" className="py-20 bg-[#111827] dark:bg-[#041f00]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[#D4AF37] dark:text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">
            Live Markets
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
            Real-Time Market Data
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
            Track stocks and cryptocurrencies with live price updates
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stocks or crypto (e.g., AAPL, Bitcoin)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* Market List */}
        <div className="space-y-3">
          {filteredMarkets.length > 0 ? (
            filteredMarkets.map((market, index) => (
              <motion.div
                key={market.symbol}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 5 }}
                className="glass-card p-5 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  {/* Left: Symbol & Name */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#16a34a]/20">
                      <img 
                        src={market.logo} 
                        alt={market.symbol}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-[#16a34a] font-bold text-lg">${market.symbol.charAt(0)}</span>`;
                          }
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {market.symbol}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {market.name}
                      </p>
                    </div>
                  </div>

                  {/* Center: Price */}
                  <div className="text-center px-6">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${market.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Right: Change & Stats */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div
                        className={`flex items-center gap-2 justify-end mb-1 ${
                          market.change >= 0 ? 'text-[#16a34a]' : 'text-red-500'
                        }`}
                      >
                        {market.change >= 0 ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                        <span className="font-semibold text-lg">
                          {market.change >= 0 ? '+' : ''}
                          {market.change.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          market.change >= 0 ? 'text-[#16a34a]' : 'text-red-500'
                        }`}
                      >
                        {market.changePercent >= 0 ? '+' : ''}
                        {market.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      <div>Vol: {market.volume}</div>
                      <div>Cap: {market.marketCap}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No markets found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LiveMarkets;
