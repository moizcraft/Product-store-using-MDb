import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import ScrollToTop from '../components/ScrollToTop';

export function SuperAdminLayout() {
  return (
    <div className="font-body bg-[var(--color-neutral-50)] text-[var(--color-neutral-900)]">
      <ScrollToTop />
      <Header />
      <main className="w-full pt-16">
        <Outlet />
      </main>
    </div>
  );
}
