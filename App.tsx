import React, { useState } from 'react';
import { Page, User, AdminLog, CustomerAccount, MarketItem, Order } from './types';
import LandingPage from './pages/LandingPage';
import ProfileWalletPage from './pages/ProfileWalletPage';
import GlobalCryptoPage from './pages/GlobalCryptoPage';
import GlobalMarketPage from './pages/GlobalMarketPage';
import AdminPanelPage from './pages/AdminPanelPage';
import Layout from './components/Layout';
import ChatAssistant from './components/ChatAssistant';

// --- Mock Data lifted to App.tsx ---
const mockInitialUsers: User[] = [
  {
    id: 'user-001',
    name: 'Han Solo',
    email: 'han.solo@example.com',
    avatar: 'https://i.pravatar.cc/64?u=han',
    wallet: { 'BTC': 0.523, 'ETH': 2.15, 'USDT': 12500.75 },
    permissions: { canTrade: true, canWithdraw: true, canSell: true, canAccessAdminPanel: false },
    winLossRecord: { wins: 15, losses: 7 },
    isActive: true,
  },
  {
    id: 'user-002',
    name: 'Leia Organa',
    email: 'leia.organa@example.com',
    avatar: 'https://i.pravatar.cc/64?u=leia',
    wallet: { 'BTC': 0.01, 'USDT': 5000.00 },
    permissions: { canTrade: true, canWithdraw: true, canSell: true, canAccessAdminPanel: false },
    winLossRecord: { wins: 8, losses: 3 },
    isActive: true,
  },
  {
    id: 'user-003',
    name: 'Luke Skywalker',
    email: 'luke.skywalker@example.com',
    avatar: 'https://i.pravatar.cc/64?u=luke',
    wallet: { 'ETH': 0.1, 'BNB': 5.0, 'USDT': 200.00 },
    permissions: { canTrade: false, canWithdraw: false, canSell: false, canAccessAdminPanel: false },
    winLossRecord: { wins: 2, losses: 9 },
    isActive: false,
  },
];

const mockInitialCustomerAccounts: CustomerAccount[] = [
  { id: 'cust-100', name: 'Darth Customer', email: 'darth.c@example.com', status: 'Active' },
  { id: 'cust-101', name: 'Yoda Shopper', email: 'yoda.s@example.com', status: 'Active' },
];

const mockInitialMarketItems: MarketItem[] = [
  { id: 'prod-001', name: 'K-2SO Droid Part', price: 450, image: 'https://picsum.photos/seed/k2so/100/100', seller: 'Han Solo', sellerId: 'user-001', stock: 10 },
  { id: 'prod-002', name: 'Diplomatic Seal Replica', price: 150, image: 'https://picsum.photos/seed/seal/100/100', seller: 'Leia Organa', sellerId: 'user-002', stock: 50 },
  { id: 'prod-003', name: 'Black Cape Fabric (Bulk)', price: 50, image: 'https://picsum.photos/seed/cape/100/100', seller: 'Leia Organa', sellerId: 'user-002', stock: 200 },
  { id: 'prod-004', name: 'Jedi Training Manual', price: 800, image: 'https://picsum.photos/seed/jedi/100/100', seller: 'Luke Skywalker', sellerId: 'user-003', stock: 5 },
];

const mockInitialOrders: Order[] = [
  { id: 'CM-1023', date: '2024-07-28', status: 'Pending', buyer: 'Darth Customer', buyerId: 'cust-100', seller: 'Han Solo', sellerId: 'user-001', shippingAddress: 'Tatooine, Outer Rim', message: 'May the force be with this delivery.', products: [{itemId: 'prod-001', name: 'K-2SO Droid Part', qty: 1, price: 450}], total: 450},
  { id: 'CM-1022', date: '2024-07-27', status: 'Shipped', buyer: 'Yoda Shopper', buyerId: 'cust-101', seller: 'Leia Organa', sellerId: 'user-002', shippingAddress: 'Alderaan Palace', message: '', products: [{itemId: 'prod-002', name: 'Diplomatic Seal Replica', qty: 2, price: 150}], total: 300},
  { id: 'CM-1021', date: '2024-07-26', status: 'Delivered', buyer: 'Darth Customer', buyerId: 'cust-100', seller: 'Leia Organa', sellerId: 'user-002', shippingAddress: 'Death Star, Sector 1', message: 'The packaging is... acceptable.', products: [{itemId: 'prod-003', name: 'Black Cape Fabric (Bulk)', qty: 10, price: 50}], total: 500},
];
// --- End Mock Data ---


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [users, setUsers] = useState<User[]>(mockInitialUsers);
  const [customerAccounts, setCustomerAccounts] = useState<CustomerAccount[]>(mockInitialCustomerAccounts);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(mockInitialMarketItems);
  const [orders, setOrders] = useState<Order[]>(mockInitialOrders);


  const renderPage = () => {
    switch (currentPage) {
      case Page.LANDING:
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case Page.PROFILE_WALLET:
        return <ProfileWalletPage setCurrentPage={setCurrentPage} />;
      case Page.GLOBAL_CRYPTO:
        return <GlobalCryptoPage users={users} setUsers={setUsers} />; // Pass users and setter
      case Page.GLOBAL_MARKET:
        return <GlobalMarketPage orders={orders} setOrders={setOrders} marketItems={marketItems} />; // Pass orders and setter, market items
      case Page.ADMIN_PANEL:
        return (
          <AdminPanelPage
            users={users}
            setUsers={setUsers}
            customerAccounts={customerAccounts}
            setCustomerAccounts={setCustomerAccounts}
            marketItems={marketItems}
            orders={orders}
            setOrders={setOrders}
          />
        );
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {renderPage()}
      </Layout>
      <ChatAssistant />
    </div>
  );
};

export default App;