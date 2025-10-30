import React, { useState, useMemo, useEffect } from 'react';
import { CryptoData, User } from '../types';
import TradingViewWidget from '../components/TradingViewWidget';
import { ChevronUpIcon, ChevronDownIcon, AdjustmentsHorizontalIcon, XCircleIcon } from '@heroicons/react/24/outline'; // Added AdjustmentsHorizontalIcon, XCircleIcon

interface GlobalCryptoPageProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const mockCryptoData: CryptoData[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 60123.45, change24h: 2.5, marketCap: 1200000000000, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/btc.svg', balance: 0.523, high24h: 61500, low24h: 59800, volume24h: 50234, volume24hUSDT: 3020000000 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3012.34, change24h: -1.2, marketCap: 360000000000, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/eth.svg', balance: 2.15, high24h: 3050, low24h: 2980, volume24h: 750123, volume24hUSDT: 2260000000 },
  // Fix: Added missing 'symbol' property for BNB
  { id: 'bnb', name: 'BNB', symbol: 'BNB', price: 580.50, change24h: 5.1, marketCap: 89000000000, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/bnb.svg', balance: 10.0, high24h: 590, low24h: 550, volume24h: 1200000, volume24hUSDT: 696000000 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150.75, change24h: -3.8, marketCap: 70000000000, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/sol.svg', balance: 50.0, high24h: 155, low24h: 148, volume24h: 5300000, volume24hUSDT: 798000000 },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.125, change24h: 1.5, marketCap: 18000000000, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/doge.svg', balance: 12000.0, high24h: 0.128, low24h: 0.122, volume24h: 1500000000, volume24hUSDT: 187500000 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: 0.8, marketCap: 16000000000, logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e37488ba26e3ba1f554625b1981a54/svg/color/ada.svg', balance: 8000.0, high24h: 0.46, low24h: 0.44, volume24h: 800000000, volume24hUSDT: 360000000 },
];

const GlobalCryptoPage: React.FC<GlobalCryptoPageProps> = ({ users, setUsers }) => { // Receive users and setUsers
    const [activeSymbol, setActiveSymbol] = useState('BTC');
    const [chartInterval, setChartInterval] = useState('D');
    const [showAdminWinLossModal, setShowAdminWinLossModal] = useState(false); // State for modal visibility

    const selectedCrypto = useMemo(() => 
        mockCryptoData.find(c => c.symbol === activeSymbol) || mockCryptoData[0],
        [activeSymbol]
    );

    const [activeTab, setActiveTab] = useState('Trading');
    
    const [livePrice, setLivePrice] = useState(selectedCrypto.price);
    const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        setLivePrice(selectedCrypto.price);
        const interval = setInterval(() => {
            setLivePrice(prevPrice => {
                const change = (Math.random() - 0.5) * (prevPrice * 0.0005);
                const newPrice = prevPrice + change;
                setPriceFlash(newPrice > prevPrice ? 'up' : 'down');
                setTimeout(() => setPriceFlash(null), 400);
                return newPrice;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [selectedCrypto]);


    const renderPanel = () => {
        switch (activeTab) {
            case 'Trading': return <TradePanel crypto={selectedCrypto} />;
            case 'Futures': return <FuturesPanel crypto={selectedCrypto} />;
            case 'Earn': return <EarnPanel />;
            default: return <TradePanel crypto={selectedCrypto} />;
        }
    };
    
    return (
        <div className="bg-background flex flex-1 h-[calc(100vh-4rem)] relative"> {/* Adjusted height, added relative */}
            {/* Admin Win/Loss Control Button */}
            <button
                onClick={() => setShowAdminWinLossModal(true)}
                className="absolute top-4 left-4 bg-accent text-background p-2 rounded-md shadow-md hover:opacity-90 transition-opacity z-20 flex items-center gap-1 text-sm font-semibold"
                title="Admin: Adjust User Win/Loss"
            >
                <AdjustmentsHorizontalIcon className="h-5 w-5" /> Admin: Win/Loss
            </button>

            {/* Left Sidebar */}
            <aside className="w-60 bg-background flex-shrink-0 overflow-y-auto flex flex-col border-r border-panel">
                <MarketList selectedSymbol={selectedCrypto.symbol} onSelect={(c) => setActiveSymbol(c.symbol)} />
            </aside>
            
            {/* Main Chart Area */}
            <main className="flex-1 flex flex-col">
                <ChartHeader crypto={selectedCrypto} livePrice={livePrice} priceFlash={priceFlash} />
                <ChartControls activeInterval={chartInterval} setInterval={setChartInterval} />
                <div className="flex-1">
                    <TradingViewWidget 
                      symbol={`${selectedCrypto.symbol}USDT`} 
                      allowSymbolChange={false} 
                      interval={chartInterval}
                      hideTopToolbar={true}
                    />
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 bg-background flex-shrink-0 overflow-y-auto flex flex-col border-l border-panel">
                <div className="p-4">
                  <FeatureTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                  <div className="mt-4">{renderPanel()}</div>
                </div>
                <div className="flex-1 flex flex-col gap-4 px-4 pb-4">
                  <OrderBook livePrice={livePrice} />
                  <RecentTrades />
                </div>
            </aside>

            {/* Admin Win/Loss Modal */}
            {showAdminWinLossModal && (
                <AdminWinLossControlModal
                    users={users}
                    setUsers={setUsers}
                    onClose={() => setShowAdminWinLossModal(false)}
                />
            )}
        </div>
    );
};

// --- Admin Win/Loss Control Modal Component ---
interface AdminWinLossControlModalProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    onClose: () => void;
}

const AdminWinLossControlModal: React.FC<AdminWinLossControlModalProps> = ({ users, setUsers, onClose }) => {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [currentWins, setCurrentWins] = useState(0);
    const [currentLosses, setCurrentLosses] = useState(0);

    const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId), [users, selectedUserId]);

    useEffect(() => {
        if (selectedUser) {
            setCurrentWins(selectedUser.winLossRecord.wins);
            setCurrentLosses(selectedUser.winLossRecord.losses);
        } else {
            setCurrentWins(0);
            setCurrentLosses(0);
        }
    }, [selectedUser]);

    const handleSave = () => {
        if (!selectedUser) return;

        if (window.confirm(`Are you sure you want to update win/loss for ${selectedUser.name}?`)) {
            setUsers(prevUsers => prevUsers.map(u => 
                u.id === selectedUser.id 
                    ? { ...u, winLossRecord: { wins: currentWins, losses: currentLosses } } 
                    : u
            ));
            alert(`Win/loss updated for ${selectedUser.name}!`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-background bg-opacity-75 flex items-center justify-center z-[100]">
            <div className="bg-panel p-6 rounded-lg w-full max-w-lg border-2 border-accent max-h-[90vh] overflow-y-auto relative">
                <h3 className="text-xl font-bold text-accent mb-4">Admin: Adjust User Win/Loss</h3>
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
                    <XCircleIcon className="h-6 w-6" />
                </button>

                <div className="space-y-4 text-sm">
                    <div>
                        <label className="block text-text-secondary mb-1">Select User</label>
                        <select
                            value={selectedUserId || ''}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full bg-background p-2 rounded-md border border-panel focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        >
                            <option value="">-- Select a User --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedUser && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-text-secondary mb-1">Wins</label>
                                <input
                                    type="number"
                                    value={currentWins}
                                    onChange={(e) => setCurrentWins(parseInt(e.target.value) || 0)}
                                    className="w-full bg-background p-2 rounded-md border border-panel focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-text-secondary mb-1">Losses</label>
                                <input
                                    type="number"
                                    value={currentLosses}
                                    onChange={(e) => setCurrentLosses(parseInt(e.target.value) || 0)}
                                    className="w-full bg-background p-2 rounded-md border border-panel focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="bg-panel text-text-primary px-5 py-2 rounded-md hover:bg-background transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={!selectedUser} className="bg-accent text-background px-5 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components (Unchanged, passed users/setUsers where relevant) ---
const formatCompactNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
}

const ChartHeader: React.FC<{crypto: CryptoData; livePrice: number; priceFlash: 'up' | 'down' | null}> = ({ crypto, livePrice, priceFlash }) => {
    const priceChange = crypto.price * (crypto.change24h / 100);
    const isPositive = crypto.change24h >= 0;

    const flashClass = priceFlash === 'up' ? 'flash-up' : priceFlash === 'down' ? 'flash-down' : '';

    return (
        <div className="p-4 border-b border-panel flex items-center gap-6 overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-3 flex-shrink-0">
                <img src={crypto.logo} alt={crypto.name} className="h-8 w-8"/>
                <h1 className="text-xl font-bold text-text-primary">{crypto.symbol}<span className="text-text-secondary text-sm">/USDT</span></h1>
                <p className="text-sm text-text-secondary">{crypto.name}</p>
            </div>
            <div className="flex gap-6 text-sm"> {/* Increased gap here */}
                <div className="flex-shrink-0">
                    <p className="text-text-secondary text-xs">Last Price</p>
                    <p className={`text-2xl font-bold py-1 rounded-md px-1 ${isPositive ? 'text-positive' : 'text-negative'} ${flashClass} font-mono`}>{livePrice.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits: 2})}</p>
                </div>
                <div className="flex-shrink-0">
                    <p className="text-text-secondary text-xs">24h Change</p>
                    <p className={`font-bold ${isPositive ? 'text-positive' : 'text-negative'} font-mono`}>{isPositive && '+'}{priceChange.toFixed(2)} ({crypto.change24h.toFixed(2)}%)</p>
                </div>
                 <div className="flex-shrink-0">
                    <p className="text-text-secondary text-xs">24h High</p>
                    <p className="font-semibold font-mono">{crypto.high24h.toLocaleString()}</p>
                </div>
                 <div className="flex-shrink-0">
                    <p className="text-text-secondary text-xs">24h Low</p>
                    <p className="font-semibold font-mono">{crypto.low24h.toLocaleString()}</p>
                </div>
                 <div className="flex-shrink-0">
                    <p className="text-text-secondary text-xs">24h Volume ({crypto.symbol})</p>
                    <p className="font-semibold font-mono">{formatCompactNumber(crypto.volume24h)}</p>
                </div>
                 <div className="flex-shrink-0">
                    <p className="text-text-secondary text-xs">24h Volume (USDT)</p>
                    <p className="font-semibold font-mono">{formatCompactNumber(crypto.volume24hUSDT)}</p>
                </div>
            </div>
        </div>
    )
}

const ChartControls: React.FC<{activeInterval: string; setInterval: (interval: string) => void}> = ({ activeInterval, setInterval }) => {
    const intervals = [
        { label: '15m', value: '15' },
        { label: '1H', value: '60' },
        { label: '4H', value: '240' },
        { label: '1D', value: 'D' },
        { label: '1W', value: 'W' },
        { label: '1M', value: 'M' },
    ];
    return (
        <div className="p-2 border-b border-panel flex items-center gap-2">
            {intervals.map(interval => (
                <button 
                    key={interval.value} 
                    onClick={() => setInterval(interval.value)}
                    className={`px-2 py-1.5 text-xs rounded-md ${activeInterval === interval.value ? 'bg-accent text-background font-bold' : 'text-text-secondary hover:bg-panel hover:font-semibold'}`}
                >
                    {interval.label}
                </button>
            ))}
        </div>
    );
};


const MarketList: React.FC<{selectedSymbol:string,onSelect:(c:CryptoData)=>void}> = ({selectedSymbol,onSelect})=>{
    const [searchQuery, setSearchQuery] = useState('');
    const filteredData = mockCryptoData.filter(crypto =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="p-2 border-b border-panel">
                 <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-background text-text-primary px-2 py-1.5 rounded-md border border-panel text-xs focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] text-xs text-text-secondary p-2 border-b border-panel flex-shrink-0">
                <span>Asset</span>
                <span className="text-right">Price</span>
                <span className="text-right">24h %</span>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {filteredData.sort((a,b)=>b.marketCap-a.marketCap).map(c=>(
                    <div key={c.id} onClick={()=>onSelect(c)} className={`grid grid-cols-[1fr_auto_auto] text-sm p-1.5 px-2 rounded-md cursor-pointer ${selectedSymbol===c.symbol?'bg-panel':'hover:bg-background'}`}>
                        <span className="font-semibold">{c.symbol}</span>
                        <span className="text-right text-text-secondary font-mono">{c.price.toLocaleString()}</span>
                        <span className={`text-right font-medium font-mono ${c.change24h>=0?'text-positive':'text-negative'}`}>{c.change24h.toFixed(2)}%</span>
                    </div>
                ))}
            </div>
        </>
    );
};
const OrderBook: React.FC<{livePrice: number}>=({livePrice})=>(<div className="text-xs bg-background p-2 flex-1 flex flex-col"><div className="grid grid-cols-3 text-text-secondary p-1 border-b border-panel"><span>Price</span><span className="text-right">Amount</span><span className="text-right">Total</span></div><div className="space-y-0.5 my-1 font-mono">{[...Array(7)].map((_,i)=>(<div key={i} className="grid grid-cols-3 relative h-6 items-center px-2"><span className="text-negative">{(livePrice+(7-i)*5).toFixed(2)}</span><span className="text-right">0.{(7-i)*123}</span><span className="text-right">{(i+1)*2345}</span><div className="absolute top-0 right-0 h-full bg-negative/20" style={{width:`${(7-i)*12}%`}}></div></div>))}</div><div className={`text-lg font-bold text-center py-2 text-positive border-y border-panel font-mono`}>{livePrice.toFixed(2)}</div><div className="space-y-0.5 my-1 font-mono">{[...Array(7)].map((_,i)=>(<div key={i} className="grid grid-cols-3 relative h-6 items-center px-2"><span className="text-positive">{(livePrice-(i+1)*5).toFixed(2)}</span><span className="text-right">0.{i*123+50}</span><span className="text-right">{(i+1)*1234}</span><div className="absolute top-0 right-0 h-full bg-positive/20" style={{width:`${(i+1)*12}%`}}></div></div>))}</div></div>);
const RecentTrades: React.FC = () => (<div className="text-xs bg-background p-2"><div className="grid grid-cols-3 text-text-secondary p-1 border-b border-panel"><span>Price (USDT)</span><span className="text-right">Amount (BTC)</span><span className="text-right">Time</span></div><div className="space-y-0.5 my-1 font-mono">{[...Array(7)].map((_,i)=>{const isBuy=Math.random()>0.5;return(<div key={i} className="grid grid-cols-3 items-center h-6 px-2"><span className={isBuy?'text-positive':'text-negative'}>60123.{(45+i*5).toFixed(0)}</span><span className="text-right">0.00{(10+i*2)}</span><span className="text-right text-text-secondary">14:05:{(30+i*2)}</span></div>)})}</div></div>);
const FeatureTabs: React.FC<{activeTab:string,setActiveTab:(t:string)=>void}>=({activeTab,setActiveTab})=>{const tabs=['Trading','Futures','Earn'];return(<div className="flex border-b border-panel">{tabs.map(t=>(<button key={t} onClick={()=>setActiveTab(t)} className={`py-2 px-4 font-semibold text-sm ${activeTab===t?'text-accent border-b-2 border-accent font-bold':'text-text-secondary hover:text-text-primary hover:border-b-2 hover:border-text-secondary'}`}>{t}</button>))}</div>)};
const TradePanel: React.FC<{crypto:CryptoData}> = ({crypto})=>(<div className="space-y-3"><div className="grid grid-cols-2 gap-2"><button className="bg-positive hover:opacity-90 font-bold py-2.5 rounded-md transition-opacity text-white text-sm">Buy</button><button className="bg-negative hover:opacity-90 font-bold py-2.5 rounded-md transition-opacity text-white text-sm">Sell</button></div><select className="w-full bg-background p-2 rounded-md border border-panel text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"><option>Market</option><option>Limit</option></select><div><label className="text-xs text-text-secondary">Amount ({crypto.symbol})</label><input type="number" placeholder="0.00" className="w-full bg-background p-2 rounded-md border border-panel text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"/></div><div><label className="text-xs text-text-secondary">Total (USDT)</label><input type="number" placeholder="0.00" className="w-full bg-background p-2 rounded-md border border-panel text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"/></div><button className="w-full bg-accent text-background font-bold py-3 rounded-md transition-opacity text-sm hover:opacity-90">Login to Trade</button></div>);
const FuturesPanel: React.FC<{crypto:CryptoData}>=({crypto})=>(<div className="text-center space-y-4"><p className="text-text-secondary text-sm">Predict price movements.</p><input type="number" placeholder="Amount (USDT)" className="w-full bg-background p-2 rounded-md border border-panel text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"/><div className="flex gap-4"><button className="w-full bg-positive py-2.5 rounded-md flex flex-col items-center hover:opacity-90 font-bold text-white"><ChevronUpIcon className="h-6 w-6"/> UP</button><button className="w-full bg-negative py-2.5 rounded-md flex flex-col items-center hover:opacity-90 font-bold text-white"><ChevronDownIcon className="h-6 w-6"/> DOWN</button></div></div>);
const EarnPanel: React.FC=()=>(<div><h2 className="text-lg font-bold text-accent mb-2">Earn Products</h2><div className="space-y-3"><EarnCard title="Flexible Savings" description="0.40% / day"/><EarnCard title="Fixed-Term (30D)" description="1.85% return"/></div></div>);
const EarnCard: React.FC<{title:string,description:string}>=({title,description})=>(<div className="bg-panel p-4 rounded-lg border border-panel"><h3 className="font-semibold text-text-primary text-sm">{title}</h3><p className="text-lg font-bold text-accent font-mono">{description}</p></div>);

export default GlobalCryptoPage;