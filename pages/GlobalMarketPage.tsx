import React, { useState } from 'react';
import { 
  MarketItem, Order 
} from '../types';
import { 
  UserCircleIcon, CheckBadgeIcon, NoSymbolIcon, 
  Squares2X2Icon, CubeIcon, ShoppingCartIcon, SparklesIcon, TruckIcon, HeartIcon, PlusIcon
} from '@heroicons/react/24/solid'; // Menambahkan ikon yang relevan untuk penggunaan di komponen ini

interface GlobalMarketPageProps {
  marketItems: MarketItem[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const GlobalMarketPage: React.FC<GlobalMarketPageProps> = ({ marketItems, orders, setOrders }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = marketItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent flex items-center gap-2">
        <ShoppingCartIcon className="h-8 w-8" /> Global Market
      </h1>
      <p className="text-text-secondary">Jelajahi dan kelola item pasar dan pesanan terbaru.</p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Cari item pasar..."
        className="w-full bg-panel text-text-primary px-4 py-2 rounded-md border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Market Items List */}
      <div className="bg-panel p-4 rounded-lg border-2 border-accent shadow-md">
        <h2 className="text-xl font-semibold text-accent mb-4">Item Tersedia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="bg-background p-3 rounded-lg flex items-center gap-3 border border-panel hover:bg-panel transition-colors">
                <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
                <div>
                  <h3 className="text-text-primary font-semibold">{item.name}</h3>
                  <p className="text-text-secondary text-sm">Penjual: {item.seller}</p>
                  <p className="text-accent font-bold font-mono">{item.price} USDT <span className="text-text-secondary text-xs">| Stok: {item.stock}</span></p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-secondary col-span-full text-center">Tidak ada item pasar ditemukan.</p>
          )}
        </div>
      </div>

      {/* Recent Orders List (simple display) */}
      <div className="bg-panel p-4 rounded-lg border-2 border-accent shadow-md">
        <h2 className="text-xl font-semibold text-accent mb-4">Pesanan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-background text-text-secondary">
                <th className="p-3">ID Pesanan</th>
                <th className="p-3">Pembeli</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => ( // Tampilkan hanya beberapa pesanan terbaru
                <tr key={order.id} className="border-t border-background hover:bg-background">
                  <td className="p-3 font-semibold font-mono">{order.id}</td>
                  <td className="p-3">{order.buyer}</td>
                  <td className="p-3 font-mono">{order.total.toLocaleString()} USDT</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Pending' ? 'bg-accent/20 text-accent' :
                      order.status === 'Shipped' ? 'bg-text-secondary/20 text-text-secondary' :
                      order.status === 'Delivered' ? 'bg-positive/20 text-positive' :
                      order.status === 'Cancelled' ? 'bg-negative/20 text-negative' :
                      'bg-text-secondary/20 text-text-secondary'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-text-secondary font-mono">{order.date}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="p-3 text-center text-text-secondary">Belum ada pesanan terbaru.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GlobalMarketPage;