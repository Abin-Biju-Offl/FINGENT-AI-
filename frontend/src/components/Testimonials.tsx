import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Investor',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=667eea&color=fff',
      rating: 5,
      text: 'Fingent AI has transformed how I manage my investments. The AI-powered insights are incredibly accurate and have helped me increase my returns by 30%.',
    },
    {
      name: 'Michael Chen',
      role: 'Financial Analyst',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=764ba2&color=fff',
      rating: 5,
      text: "The real-time market data and portfolio tracking features are outstanding. I've recommended this platform to all my colleagues.",
    },
    {
      name: 'Emily Rodriguez',
      role: 'Entrepreneur',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=10b981&color=fff',
      rating: 5,
      text: "As someone new to investing, the educational tools and AI guidance made it easy to get started. Best financial platform I've used!",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
            Real stories from real investors
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary-200 dark:text-primary-900" />
              
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
