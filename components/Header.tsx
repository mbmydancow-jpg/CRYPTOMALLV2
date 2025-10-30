import React, { useState } from 'react';
import { Page, NavItem } from '../types';
import { 
  HomeIcon, UserCircleIcon, GlobeAltIcon, ShoppingCartIcon, ShieldCheckIcon, Bars3Icon, XMarkIcon,
  ClipboardDocumentListIcon, ChatBubbleBottomCenterTextIcon, UserPlusIcon, ChartBarIcon // Added for AdminPanel visibility
} from '@heroicons/react/24/solid';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const navItems: NavItem[] = [
  { label: 'Home', page: Page.LANDING, icon: HomeIcon },
  { label: 'Profile & Wallet', page: Page.PROFILE_WALLET, icon: UserCircleIcon },
  { label: 'Global Crypto', page: Page.GLOBAL_CRYPTO, icon: GlobeAltIcon },
  { label: 'Global Market', page: Page.GLOBAL_MARKET, icon: ShoppingCartIcon },
  { label: 'Admin Panel', page: Page.ADMIN_PANEL, icon: ShieldCheckIcon },
];

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-accent">CRYPTO MALL</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setCurrentPage(item.page)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${currentPage === item.page ? 'text-accent font-bold bg-panel/50' : 'text-text-secondary hover:text-text-primary hover:bg-panel'}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
            <button className="bg-accent text-background font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 shadow-sm">
              Login
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent p-2 rounded-md"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-panel pb-3 border-t border-accent/20 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setCurrentPage(item.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${currentPage === item.page ? 'bg-accent text-background' : 'text-text-secondary hover:bg-panel hover:text-text-primary'}`}
              >
                <item.icon className="h-6 w-6" />
                <span>{item.label}</span>
              </button>
            ))}
            <button className="w-full text-left bg-accent text-background font-semibold px-4 py-2 rounded-md mt-2 hover:opacity-90 transition-opacity duration-200 shadow-sm">
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;