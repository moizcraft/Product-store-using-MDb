import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <ScrollToTop />
       {/* Left: Decorative / Brand */}
       <div className="hidden lg:flex flex-col justify-center items-center bg-[var(--color-primary)] text-[var(--color-primary-foreground)] p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-md text-center">
                 <h1 className="text-4xl font-bold font-display mb-6">Welcome to VibeWear</h1>
                 <p className="text-lg opacity-90 leading-relaxed">
                     Experience the finest collection of authentic Pakistani craftsmanship and modern design.
                 </p>
            </div>
            {/* Abstract Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
            }}></div>
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
