import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { apiService, NewsArticle } from '../services/api';

const NewsSection = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'markets', label: 'Markets' },
    { id: 'economy', label: 'Economy' },
  ];

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  const fetchNews = async (category: string) => {
    setLoading(true);
    try {
      const response = await apiService.getNews(category);
      setNews(response.articles.slice(0, 6));
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section id="news" className="py-20 bg-[#111827] dark:bg-[#041f00]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#D4AF37] dark:text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">
            Latest News
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
            Stay Updated With Financial News
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
            Real-time updates from trusted financial sources
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 gap-3 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {news.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                {article.urlToImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/400x200?text=News+Image';
                      }}
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Newspaper className="w-4 h-4" />
                    <span>{article.source.name}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#D4AF37] dark:group-hover:text-[#D4AF37] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {article.description}
                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#D4AF37] dark:text-[#D4AF37] font-semibold text-sm group-hover:gap-3 transition-all"
                  >
                    Read More
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
