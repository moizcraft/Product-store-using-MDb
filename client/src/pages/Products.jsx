import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';
import { Button } from '../components/ui/button';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

const fetchProducts = async () => {
    const { data } = await api.get('/products/getAllProducts');
    return data.products;
};

const Products = () => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [addedItems, setAddedItems] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    const [filter, setFilter] = useState('all');

    // Set filter from query parameter on mount and when query params change
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setFilter(categoryParam);
        } else {
            setFilter('all');
        }
    }, [searchParams]);

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        addToCart(product);
        setAddedItems(prev => ({ ...prev, [product._id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product._id]: false }));
        }, 2000);
    };

    const handleProductClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            e.stopPropagation();
            setShowLoginModal(true);
        }
    };

    // Use real categories from products
    const categories = products ? Array.from(new Set(products.map(p => p.category))) : [];

    // Filter products by category and search query
    const filteredProducts = products?.filter(p => {
        const matchesCategory = filter === 'all' || p.category === filter;
        const matchesSearch = !searchQuery || 
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (isLoading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
                    <p className="text-gray-500">Please try again later.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="container mx-auto px-4 py-8"
            >
                <motion.div 
                    className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {searchQuery ? `Search Results for "${searchQuery}"` : 'Marketplace'}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {searchQuery 
                                ? `Found ${filteredProducts?.length || 0} product(s)` 
                                : 'Explore quality products from trusted sellers.'}
                        </p>
                    </motion.div>

                    <motion.div 
                        className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 flex-wrap justify-center md:justify-end"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                variant={filter === 'all' ? 'primary' : 'outline'} 
                                size="sm" 
                                onClick={() => setFilter('all')}
                                className="transition-all duration-300"
                            >
                                All Products
                            </Button>
                        </motion.div>
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant={filter === cat ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter(cat)}
                                    className="capitalize px-4 transition-all duration-300"
                                >
                                    {cat}
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div 
                    layout 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts?.map((product, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ 
                                    duration: 0.4,
                                    delay: index * 0.06,
                                    ease: "easeOut"
                                }}
                                key={product._id}
                                className="group"
                            >
                                <Link to={isAuthenticated ? `/products/${product._id}` : '#'} onClick={handleProductClick}>
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden bg-gray-100">
                                            <img
                                                src={product.imageUrl || "https://placehold.co/400x500?text=No+Image"}
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
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="mb-2">
                                                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                                                {product.description}
                                            </p>
                                            
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-2xl font-black text-gray-900">
                                                    Rs. {product.price}
                                                </span>
                                                <motion.button
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                                        addedItems[product._id]
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                    }`}
                                                >
                                                    {addedItems[product._id] ? (
                                                        <Check className="w-5 h-5" />
                                                    ) : (
                                                        <ShoppingBag className="w-5 h-5" />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                    {(!filteredProducts || filteredProducts.length === 0) && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 0.5, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <p className="text-lg text-gray-400 font-medium">No products found.</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    )
}

export default Products