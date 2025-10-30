import React from 'react';
import { Page } from '../types';

interface LandingPageProps {
  setCurrentPage: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-accent drop-shadow-md">
        Welcome to Crypto Mall!
      </h1>
      <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 drop-shadow-sm">
        Your Gateway to Timeless Digital Prosperity
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button
          onClick={() => setCurrentPage(Page.PROFILE_WALLET)}
          className="bg-accent text-background font-semibold px-10 py-4 rounded-full text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-accent/40"
        >
          Go to Profile & Wallet
        </button>
        <button
          onClick={() => setCurrentPage(Page.GLOBAL_CRYPTO)}
          className="bg-background border-2 border-accent/50 text-text-primary font-semibold px-10 py-4 rounded-full text-lg hover:bg-panel transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-panel/50"
        >
          Explore Global Crypto
        </button>
      </div>
    </div>
  );
};

export default LandingPage;