import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import ScrollToTop from '../components/ScrollToTop';

export function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen font-body bg-[var(--color-neutral-50)] text-[var(--color-neutral-900)]">
      <ScrollToTop />
      <Header />
      <main className="flex-1 w-full pt-16">
        <Outlet />
      </main>
      {/* No Footer in Dashboard */}
    </div>
  );
}
