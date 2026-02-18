import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <ScrollToTop />
       {/* Left: Decorative / Brand */}
       <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-12 relative overflow-hidden">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
                style={{ animation: 'pulse 20s ease-in-out infinite' }}
              />
              <div 
                className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
                style={{ animation: 'pulse 15s ease-in-out infinite', animationDelay: '2s' }}
              />
            </div>

            <div className="relative z-10 max-w-md text-center">
                 <h1 className="text-4xl font-bold font-display mb-6">Welcome to VibeWear</h1>
                 <p className="text-lg opacity-90 leading-relaxed">
                     Experience the finest collection of authentic Pakistani craftsmanship and modern design.
                 </p>
            </div>
       </div>

       {/* Right: Form Form */}
       <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
            <div className="w-full max-w-md space-y-8">
                 <div className="text-center lg:hidden mb-8">
                    <Link to="/" className="text-3xl font-bold font-display" style={{ color: '#6c1f2e' }}>VibeWear</Link>
                 </div>
                 <Outlet />
            </div>
       </div>
    </div>
  );
}
