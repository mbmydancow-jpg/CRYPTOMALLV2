import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-accent/20 mt-12 shadow-inner">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
        <div className="flex justify-center gap-4 md:gap-8 mb-4 text-sm">
          <a href="#" className="hover:text-accent transition-colors duration-200">Terms & Conditions</a>
          <a href="#" className="hover:text-accent transition-colors duration-200">AML/KYC Policy</a>
          <a href="#" className="hover:text-accent transition-colors duration-200">Privacy Policy</a>
        </div>
        <p className="text-xs">© 2025 Crypto Mall Global Marketplace & Digital Cryptocurrency</p>
      </div>
    </footer>
  );
};

export default Footer;