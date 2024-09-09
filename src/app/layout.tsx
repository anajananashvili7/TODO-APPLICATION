'use client';

import { useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut, UserButton, SignIn } from '@clerk/nextjs';
import Sidebar from '@/components/Sidebar';
import './globals.css';
import { Inter } from 'next/font/google';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(''); // or appropriate type and default value

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SignedIn>
            <header className="flex justify-between items-center p-4 bg-[#F6F6F7] w-full border-b border-[#C7CAD0]">
              <Bars3Icon
                className="w-6 h-6 block md:hidden cursor-pointer"
                onClick={toggleSidebar}
                aria-label="Open sidebar menu"
              />
              <div className="flex-grow flex justify-center">
                <input
                  type="text"
                  placeholder="Search"
                  style={{ paddingLeft: '3px', paddingRight: '3px' }}
                  className="w-full max-w-[400px] p-2 border-b border-[#C7CAD0] text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-1/3"
                />
              </div>
              <UserButton showName />
            </header>

            <div className="flex flex-col md:flex-row min-h-screen">
              {sidebarOpen && (
                <div
                  className="fixed inset-0 bg-gray-900 opacity-50 z-10 md:hidden"
                  onClick={closeSidebar}
                  aria-label="Close sidebar menu"
                />
              )}
              <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                <button
                  className="absolute top-4 right-4 text-gray-800 hover:text-gray-600 focus:outline-none md:hidden"
                  onClick={closeSidebar}
                  aria-label="Close sidebar menu"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <Sidebar currentPage={currentPage} onLinkClick={closeSidebar} />
              </aside>
              <main className="flex-1">
                {children}
              </main>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <SignIn routing="hash" />
              </div>
            </div>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
