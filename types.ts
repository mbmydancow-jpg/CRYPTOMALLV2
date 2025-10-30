import React from 'react';

export enum Page {
  LANDING = 'LANDING',
  PROFILE_WALLET = 'PROFILE_WALLET',
  GLOBAL_CRYPTO = 'GLOBAL_CRYPTO',
  GLOBAL_MARKET = 'GLOBAL_MARKET',
  ADMIN_PANEL = 'ADMIN_PANEL',
}

export interface NavItem {
  label: string;
  page: Page;
  icon: React.ComponentType<{ className?: string }>;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  logo: string;
  balance?: number;
  // Data tambahan untuk header chart
  high24h: number;
  low24h: number;
  volume24h: number; // Volume dalam aset (misal: 50,000 BTC)
  volume24hUSDT: number; // Volume dalam USDT
}

export interface WalletAsset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  logo: string;
}

export interface MarketItem {
  id:string;
  name: string;
  price: number;
  image: string;
  seller: string; // Name of the seller
  sellerId: string; // ID of the seller (from User)
  stock: number;
}

export interface Transaction {
  id: string;
  type: 'Buy' | 'Sell' | 'Deposit' | 'Withdraw';
  asset: string;
  amount: number;
  price: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface UserPermission {
  canTrade: boolean;
  canWithdraw: boolean;
  canSell: boolean;
  canAccessAdminPanel: boolean; // Example: if there were multi-level admins
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  wallet: Record<string, number>; // e.g., { 'BTC': 0.5, 'USDT': 1200.0 }
  permissions: UserPermission;
  winLossRecord: { wins: number; losses: number };
  isActive: boolean;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  details: string;
  status: 'Approved' | 'Pending' | 'Rejected'; // For 'izin oleh admin panel' concept
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface OrderProduct {
  itemId: string;
  name: string; // for display convenience
  qty: number;
  price: number; // price per unit at time of order
}

export interface Order {
  id: string;
  date: string; // e.g., 'YYYY-MM-DD'
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  buyer: string; // Buyer's name
  buyerId: string; // Buyer's user ID or customer account ID
  seller: string; // Seller's name
  sellerId: string; // Seller's user ID
  shippingAddress: string;
  message?: string;
  products: OrderProduct[];
  total: number;
}