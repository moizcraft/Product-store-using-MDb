import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import api from '../lib/axios';
import menImage from '../assets/image/men.jpg';
import womenImage from '../assets/image/women.jpg';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/getAllProducts');
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category
  const menAccessories = products.filter(p => p.category === 'Men Accessories').slice(0, 4);
  const womenAccessories = products.filter(p => p.category === 'Women Accessories').slice(0, 4);
  const shoes = products.filter(p => p.category === 'Shoes').slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Modern Gradient with Floating Elements */}
      <section className="relative min-h-[90vh] w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden flex items-center">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                <span>New Collection 2026</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                Style That
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                  Speaks Volumes
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed">
                Discover premium fashion for men and women. From elegant accessories to trendy footwear, find your perfect style.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/products">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-indigo-600 hover:bg-gray-100 text-base sm:text-lg px-8 py-6 rounded-full font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300 group"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 text-base sm:text-lg px-8 py-6 rounded-full font-bold transition-all duration-300"
                  >
                    View Collections
                  </Button>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-white/70 text-sm">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-white/70 text-sm">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9★</div>
                  <div className="text-white/70 text-sm">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="relative h-64 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={womenImage}
                    alt="Men Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="relative h-64 rounded-3xl overflow-hidden shadow-2xl mt-8"
                >
                  <img
                    src={menImage}
                    alt="Women Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { name: "All Products",  link: "/products" },
              { name: "Men's Accessories",  link: "/products?category=Men Accessories" },
              { name: "Women's Accessories",  link: "/products?category=Women Accessories" },
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link to={cat.link}>
                  <motion.button
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-indigo-400 rounded-full font-semibold text-gray-800 hover:text-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Men's Accessories Section */}
      {menAccessories.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl font-black text-gray-900 mb-2"
                >
                  Men's Collection
                </motion.h2>
                <p className="text-gray-600">Elevate your style with premium accessories</p>
              </div>
              <Link to="/products?category=Men Accessories">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button variant="outline" className="hidden sm:flex items-center gap-2 rounded-full">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {menAccessories.map((product, idx) => (
                <ProductCard key={product._id} product={product} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Women's Accessories Section */}
      {womenAccessories.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl font-black text-gray-900 mb-2"
                >
                  Women's Collection
                </motion.h2>
                <p className="text-gray-600">Elegant accessories for the modern woman</p>
              </div>
              <Link to="/products?category=Women Accessories">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button variant="outline" className="hidden sm:flex items-center gap-2 rounded-full">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {womenAccessories.map((product, idx) => (
                <ProductCard key={product._id} product={product} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shoes Section */}
      {shoes.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl font-black text-gray-900 mb-2"
                >
                  Footwear Collection
                </motion.h2>
                <p className="text-gray-600">Step into comfort and style</p>
              </div>
              <Link to="/products?category=Shoes">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button variant="outline" className="hidden sm:flex items-center gap-2 rounded-full">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shoes.map((product, idx) => (
                <ProductCard key={product._id} product={product} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl font-black">
              Ready to Upgrade Your Wardrobe?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of satisfied customers and discover your perfect style today.
            </p>
            <Link to="/products">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300 group mt-6"
                >
                  <ShoppingBag className="mr-2 w-5 h-5" />
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.12,
        ease: "easeOut"
      }}
    >
      <Link to={`/products/${product._id}`}>
        <motion.div
          whileHover={{ y: -12, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
        >
          {/* Image */}
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl || '/placeholder.png'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Stock Badge */}
            {product.stock > 0 ? (
              <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                In Stock
              </div>
            ) : (
              <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                Out of Stock
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-2">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-gray-900">
                Rs. {product.price}
              </span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center group-hover:bg-indigo-700 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
