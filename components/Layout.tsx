import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const isFullScreenPage = currentPage === Page.GLOBAL_CRYPTO;

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className={`flex-grow flex flex-col ${!isFullScreenPage ? 'container mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        {children}
      </main>
      {!isFullScreenPage && <Footer />}
    </div>
  );
};

export default Layout;