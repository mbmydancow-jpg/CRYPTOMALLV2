import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { EyeIcon, EyeSlashIcon, CheckBadgeIcon, NoSymbolIcon } from '@heroicons/react/24/solid';

interface ProfileWalletPageProps {
  setCurrentPage: (page: Page) => void;
}

const mockAssets = [
  { symbol: 'BTC', amount: 0.523, value: 18500, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/btc.svg' },
  { symbol: 'ETH', amount: 2.15, value: 6200, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/eth.svg' },
  { symbol: 'BNB', amount: 10.0, value: 3000, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/bnb.svg' },
  { symbol: 'DOGE', amount: 12000, value: 1200, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/doge.svg' },
  { symbol: 'SOL', amount: 50, value: 4500, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/sol.svg' },
  { symbol: 'ADA', amount: 8000, value: 2000, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/ada.svg' },
];

const totalBalance = mockAssets.reduce((acc, asset) => acc + asset.value, 0);

const adBanners = [
    { title: 'Promo BTC 0% Fee', description: 'Trade Bitcoin without any fees for a limited time!', bgClass: 'bg-gradient-to-r from-orange-500 to-yellow-500' },
    { title: 'Staking ETH 20% APR', description: 'Maximize your Ethereum holdings with high-yield staking.', bgClass: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { title: 'Launchpool BNB Rewards', description: 'Stake your BNB to earn tokens from new projects.', bgClass: 'bg-gradient-to-r from-yellow-400 to-amber-500' },
    { title: 'Dogecoin Trading Event', description: 'Join the trading competition and win a share of the prize pool!', bgClass: 'bg-gradient-to-r from-amber-300 to-orange-400' },
];

const tabs = ['Spot', 'Funding', 'Futures', 'Earn'];

const ProfileWalletPage: React.FC<ProfileWalletPageProps> = ({ setCurrentPage }) => {
  const [isVerified, setIsVerified] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Spot');
  
  useEffect(() => {
    const adTimer = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % adBanners.length);
    }, 4000);
    return () => clearInterval(adTimer);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent">Digital Wallet</h1>

      {/* 1. Profile Header */}
      <div className="bg-panel p-4 rounded-lg flex items-center gap-4 border-2 border-accent shadow-md">
        <div className="group relative">
            <img src="https://i.pravatar.cc/64?u=han" alt="User Avatar" className="h-16 w-16 rounded-full border-2 border-accent transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"/>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <span className="text-xs text-text-primary">Change</span>
            </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Han</h2>
          <div 
            className={`flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={() => setIsVerified(!isVerified)}
            title="Click to toggle status (demo)"
          >
            {isVerified ? (
              <CheckBadgeIcon className="h-5 w-5 text-positive" />
            ) : (
              <NoSymbolIcon className="h-5 w-5 text-negative" />
            )}
            <span className={`text-sm font-medium ${isVerified ? 'text-positive' : 'text-negative'}`}>
              {isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          <p className="text-sm text-text-secondary">han.solo@cryptomall.io</p>
        </div>
      </div>

      {/* 2. Wallet Balance & Actions */}
      <div className="bg-panel p-6 rounded-lg border-2 border-accent shadow-md">
        <div className="flex justify-between items-center">
            <h3 className="text-lg text-text-secondary">💰 Total Balance</h3>
            <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} className="text-text-secondary hover:text-text-primary transition-colors duration-200" aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}>
                {isBalanceVisible ? <EyeSlashIcon className="h-6 w-6"/> : <EyeIcon className="h-6 w-6"/>}
            </button>
        </div>
        <p className="text-5xl font-bold my-2 mb-4 text-text-primary font-mono">
            {isBalanceVisible ? `${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT` : <span className="text-text-secondary">****** USDT</span>}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button onClick={() => setCurrentPage(Page.GLOBAL_CRYPTO)} className="flex-1 bg-background text-text-primary font-semibold py-3 rounded-md hover:bg-panel transition-colors duration-200 shadow-sm">GLOBAL CRYPTO</button>
            <button onClick={() => setCurrentPage(Page.GLOBAL_MARKET)} className="flex-1 bg-background text-text-primary font-semibold py-3 rounded-md hover:bg-panel transition-colors duration-200 shadow-sm">GLOBAL STORE</button>
        </div>
      </div>

      {/* 4. Realtime Ad Carousel */}
      <div className="relative h-40 rounded-lg overflow-hidden shadow-md">
        {adBanners.map((ad, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 p-6 flex flex-col justify-center text-text-primary ${ad.bgClass} ${index === currentAdIndex ? 'opacity-100' : 'opacity-0'} transition-transform duration-500 hover:scale-105`}>
                <h3 className="text-xl font-bold">{ad.title}</h3>
                <p className="text-sm mt-1">{ad.description}</p>
            </div>
        ))}
      </div>

      {/* 3. Main Assets Table */}
      <div className="bg-panel p-0 rounded-lg overflow-hidden border-2 border-accent shadow-md">
        <div className="flex border-b border-background px-4 bg-background">
            {tabs.map(tab => (
                <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`py-3 px-4 font-semibold text-sm transition-colors duration-200 
                                ${activeTab === tab ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary hover:border-b-2 hover:border-text-secondary'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
        <div className="overflow-x-auto p-4">
            <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-text-secondary border-b border-background">
                    <th className="p-2 py-3">Asset</th>
                    <th className="p-2 text-right py-3">Amount</th>
                    <th className="p-2 text-right py-3">Value (USDT)</th>
                    <th className="p-2 text-right py-3">%</th>
                  </tr>
                </thead>
                <tbody>
                    {mockAssets.map(asset => (
                        <tr key={asset.symbol} className="border-b border-background hover:bg-background text-sm transition-colors duration-200">
                            <td className="p-2 py-3 flex items-center gap-3">
                                <img src={asset.logo} alt={asset.symbol} className="h-7 w-7"/>
                                <span className="font-semibold">{asset.symbol}</span>
                            </td>
                            <td className="p-2 py-3 text-right font-mono">{asset.amount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                            <td className="p-2 py-3 text-right font-mono">{asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="p-2 py-3 text-right text-text-secondary font-mono">{((asset.value / totalBalance) * 100).toFixed(0)}%</td>
                        </tr>
                    ))}
                    {mockAssets.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-4 text-center text-text-secondary">No assets in your wallet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
      
      {/* 5. Charity Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 rounded-lg flex flex-col md:flex-row items-center gap-6 shadow-md">
        <img src="https://picsum.photos/seed/charity/200/150" alt="Charity" className="w-full md:w-48 h-auto rounded-md object-cover shadow-sm"/>
        <div>
            <h3 className="text-2xl font-bold text-white">Crypto Mall Charity</h3>
            <p className="mt-2 text-white/90">Join us to make a difference. Your crypto donations can help communities in need worldwide. Every contribution counts.</p>
            <button className="mt-4 bg-accent text-background font-bold px-6 py-2 rounded-md hover:opacity-90 transition-colors duration-200 shadow-sm">Donate Now</button>
        </div>
      </div>

    </div>
  );
};

export default ProfileWalletPage;