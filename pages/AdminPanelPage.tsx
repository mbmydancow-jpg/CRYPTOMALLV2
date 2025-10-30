import React, { useState } from 'react';
import { 
  UsersIcon, ShoppingCartIcon, ShieldCheckIcon, ChartBarIcon,
  ClipboardDocumentListIcon, ChatBubbleBottomCenterTextIcon, UserPlusIcon,
  PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, CurrencyDollarIcon,
  ArrowPathIcon, CubeTransparentIcon, PlusIcon, DocumentTextIcon // Added DocumentTextIcon for Order Management
} from '@heroicons/react/24/outline';
import { User, UserPermission, AdminLog, CustomerAccount, MarketItem, Order, OrderProduct } from '../types';

type AdminSection = 'dashboard' | 'user-accounts' | 'market-listings' | 'security-settings' | 'admin-logs' | 'chat-monitoring' | 'customer-creator' | 'marketplace-orders'; // Added marketplace-orders

// --- Mock Data (moved to App.tsx, but some initial logs remain for consistency) ---
const mockInitialAdminLogs: AdminLog[] = [
  { id: 'log-001', timestamp: '2024-08-01 10:00:00', adminId: 'admin-001', action: 'Login', details: 'Admin user logged in', status: 'Approved' },
  { id: 'log-002', timestamp: '2024-08-01 10:15:30', adminId: 'admin-001', action: 'View User Accounts', details: 'Accessed user list', status: 'Approved' },
];

const mockChatLogs = [ // This can also be lifted to App.tsx if needed elsewhere or managed by backend
  { id: 'chat-001', timestamp: '2024-07-30 11:20:00', userId: 'user-001', userName: 'Han Solo', message: 'User: How do I withdraw funds?', botResponse: 'Bot: You can withdraw funds from your wallet page. Select the asset and click "Withdraw".' },
  { id: 'chat-002', timestamp: '2024-07-30 14:05:10', userId: 'user-002', userName: 'Leia Organa', message: 'User: What is the current price of BTC?', botResponse: 'Bot: The current price of Bitcoin (BTC) is approximately $60,123.45.' },
  { id: 'chat-003', timestamp: '2024-07-31 09:45:22', userId: 'user-001', userName: 'Han Solo', message: 'User: Is staking ETH profitable?', botResponse: 'Bot: Yes, staking ETH can be profitable, offering potential APR rewards. Check our "Earn" section for more details.' },
];

interface AdminPanelPageProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  customerAccounts: CustomerAccount[];
  setCustomerAccounts: React.Dispatch<React.SetStateAction<CustomerAccount[]>>;
  marketItems: MarketItem[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ 
  users, setUsers, 
  customerAccounts, setCustomerAccounts,
  marketItems,
  orders, setOrders
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(mockInitialAdminLogs);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const logAdminAction = (action: string, details: string, status: AdminLog['status'] = 'Approved') => {
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      adminId: 'current-admin-id', // In a real app, this would be dynamic
      action,
      details,
      status,
    };
    setAdminLogs((prev) => [newLog, ...prev]);
  };

  const mockCryptoSymbols = ['BTC', 'ETH', 'BNB', 'USDT', 'XRP', 'ADA']; // For user wallet management

  const handleUpdateUser = (updatedUser: User) => {
    if (window.confirm(`Are you sure you want to update user ${updatedUser.name}? This action will be logged.`)) {
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      logAdminAction('Update User', `Updated user ${updatedUser.name} (ID: ${updatedUser.id})`);
      setSelectedUser(null);
    } else {
      logAdminAction('Update User Attempt', `Attempt to update user ${updatedUser.name} was cancelled`, 'Rejected');
    }
  };

  const handleCreateCustomerAccount = (account: CustomerAccount) => {
    setCustomerAccounts((prev) => [...prev, account]);
    logAdminAction('Create Customer Account', `Created customer account: ${account.name} (${account.email})`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'user-accounts':
        return <UserAccountsSection 
                 users={users} 
                 onEditUser={setSelectedUser} 
                 selectedUser={selectedUser}
                 onSaveUser={handleUpdateUser}
                 logAdminAction={logAdminAction}
                 mockCryptoSymbols={mockCryptoSymbols}
                 onCloseEdit={() => setSelectedUser(null)}
               />;
      case 'market-listings':
        return <MarketListingsSection marketItems={marketItems} />;
      case 'security-settings':
        return <SecuritySettingsSection />;
      case 'admin-logs':
        return <AdminActionsLogSection adminLogs={adminLogs} />;
      case 'chat-monitoring':
        return <ChatMonitoringSection chatLogs={mockChatLogs} />;
      case 'customer-creator':
        return <CustomerCreatorSection onCreateAccount={handleCreateCustomerAccount} logAdminAction={logAdminAction} />;
      case 'marketplace-orders':
        return <MarketplaceOrderManagementSection 
                 users={users}
                 customerAccounts={customerAccounts}
                 marketItems={marketItems}
                 orders={orders}
                 setOrders={setOrders}
                 logAdminAction={logAdminAction}
               />;
      case 'dashboard':
      default:
        return <DashboardOverviewSection users={users} adminLogs={adminLogs} customerAccounts={customerAccounts} orders={orders} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
      {/* Sidebar */}
      <aside className="md:w-64 bg-panel p-4 rounded-lg border-2 border-accent">
        <h2 className="text-xl font-bold text-accent mb-6">Admin Menu</h2>
        <nav className="space-y-2">
          {adminNavItems.map((item) => (
            <AdminNavItem
              key={item.section}
              icon={item.icon}
              label={item.label}
              isActive={activeSection === item.section}
              onClick={() => {
                setActiveSection(item.section);
                logAdminAction('Navigate', `Navigated to ${item.label} section`);
              }}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-panel p-6 rounded-lg border-2 border-accent">
        {renderSection()}
      </main>
    </div>
  );
};

interface AdminNavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors duration-200 ${
        isActive 
          ? 'bg-accent text-background font-semibold' 
          : 'text-text-secondary hover:bg-background'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

// --- Admin Sub-Sections ---

const adminNavItems: { icon: React.ComponentType<any>; label: string; section: AdminSection }[] = [
  { icon: ChartBarIcon, label: 'Dashboard', section: 'dashboard' },
  { icon: UsersIcon, label: 'User Accounts', section: 'user-accounts' },
  { icon: ShoppingCartIcon, label: 'Market Listings', section: 'market-listings' },
  { icon: DocumentTextIcon, label: 'Marketplace Orders', section: 'marketplace-orders' }, // New
  { icon: ShieldCheckIcon, label: 'Security Settings', section: 'security-settings' },
  { icon: ClipboardDocumentListIcon, label: 'Admin Actions Log', section: 'admin-logs' },
  { icon: ChatBubbleBottomCenterTextIcon, label: 'Chat Monitoring', section: 'chat-monitoring' },
  { icon: UserPlusIcon, label: 'Customer Creator', section: 'customer-creator' },
];

interface DashboardOverviewSectionProps {
  users: User[];
  adminLogs: AdminLog[];
  customerAccounts: CustomerAccount[];
  orders: Order[]; // Added orders to dashboard props
}

const DashboardOverviewSection: React.FC<DashboardOverviewSectionProps> = ({ users, adminLogs, customerAccounts, orders }) => (
  <div>
    <h2 className="text-2xl font-bold text-accent mb-4">Dashboard Overview</h2>
    <p className="mt-2 text-text-secondary">Key metrics and system health at a glance.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"> {/* Changed to 4 columns */}
      <div className="bg-background p-4 rounded-lg border border-panel">
        <p className="text-text-secondary text-sm">Total Users</p>
        <p className="text-3xl font-bold text-text-primary font-mono">{users.length}</p>
      </div>
      <div className="bg-background p-4 rounded-lg border border-panel">
        <p className="text-text-secondary text-sm">Active Admin Logs</p>
        <p className="text-3xl font-bold text-text-primary font-mono">{adminLogs.length}</p>
      </div>
      <div className="bg-background p-4 rounded-lg border border-panel">
        <p className="text-text-secondary text-sm">Customer Accounts</p>
        <p className="text-3xl font-bold text-text-primary font-mono">{customerAccounts.length}</p>
      </div>
       <div className="bg-background p-4 rounded-lg border border-panel">
        <p className="text-text-secondary text-sm">Total Orders</p>
        <p className="text-3xl font-bold text-text-primary font-mono">{orders.length}</p>
      </div>
    </div>

    <div className="mt-6">
      <h3 className="text-xl font-bold text-accent mb-3">Recent Admin Actions</h3>
      <AdminActionsLogSection adminLogs={adminLogs.slice(0, 5)} compact={true} />
    </div>
  </div>
);

interface UserAccountsSectionProps {
  users: User[];
  onEditUser: (user: User) => void;
  selectedUser: User | null;
  onSaveUser: (user: User) => void;
  logAdminAction: (action: string, details: string, status?: AdminLog['status']) => void;
  mockCryptoSymbols: string[];
  onCloseEdit: () => void;
}

const UserAccountsSection: React.FC<UserAccountsSectionProps> = ({ users, onEditUser, selectedUser, onSaveUser, logAdminAction, mockCryptoSymbols, onCloseEdit }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-accent mb-4">User Accounts Management</h2>
      <div className="overflow-x-auto bg-background rounded-lg border border-panel">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-panel text-text-secondary">
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Permissions</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-panel hover:bg-background">
                <td className="p-3 flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                  <span>{user.name}</span>
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 text-center">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1 text-positive">
                      <CheckCircleIcon className="h-4 w-4" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-negative">
                      <XCircleIcon className="h-4 w-4" /> Inactive
                    </span>
                  )}
                </td>
                <td className="p-3 text-center text-text-secondary font-mono">
                    {Object.keys(user.permissions).filter(key => user.permissions[key as keyof UserPermission]).length} / {Object.keys(user.permissions).length}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      onEditUser(user);
                      logAdminAction('Open User Edit', `Opened edit form for user ${user.name}`);
                    }}
                    className="text-accent hover:opacity-80 p-1 rounded-md"
                    title="Edit User"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditUserModal 
          user={selectedUser} 
          onClose={onCloseEdit} // Fix: Use the passed onCloseEdit prop
          onSave={onSaveUser} 
          mockCryptoSymbols={mockCryptoSymbols} 
        />
      )}
    </div>
  );
};

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
  mockCryptoSymbols: string[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave, mockCryptoSymbols }) => {
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleWalletChange = (symbol: string, amount: number) => {
    setEditedUser((prev) => ({
      ...prev,
      wallet: { ...prev.wallet, [symbol]: amount },
    }));
  };

  const handlePermissionChange = (permission: keyof UserPermission, value: boolean) => {
    setEditedUser((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [permission]: value },
    }));
  };

  const handleWinLossChange = (type: 'wins' | 'losses', value: number) => {
    setEditedUser((prev) => ({
      ...prev,
      winLossRecord: { ...prev.winLossRecord, [type]: value },
    }));
  };

  const handleStatusChange = () => {
    setEditedUser((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  return (
    <div className="fixed inset-0 bg-background bg-opacity-75 flex items-center justify-center z-[100]">
      <div className="bg-panel p-6 rounded-lg w-full max-w-2xl border-2 border-accent max-h-[90vh] overflow-y-auto relative">
        <h3 className="text-xl font-bold text-accent mb-4">Edit User: {user.name}</h3>
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
          <XCircleIcon className="h-6 w-6" />
        </button>

        <div className="space-y-4 text-sm">
          {/* General Info */}
          <div>
            <label className="block text-text-secondary">Name</label>
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              className="w-full bg-background p-2 rounded-md border border-panel focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-text-secondary">Email</label>
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="w-full bg-background p-2 rounded-md border border-panel focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Wallet Management */}
          <div className="border-t border-panel pt-4">
            <h4 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2"><CurrencyDollarIcon className="h-5 w-5"/> Wallet Balance</h4>
            <div className="grid grid-cols-2 gap-3">
              {mockCryptoSymbols.map((symbol) => (
                <div key={symbol}>
                  <label className="block text-text-secondary">{symbol}</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editedUser.wallet[symbol] || 0}
                    onChange={(e) => handleWalletChange(symbol, parseFloat(e.target.value))}
                    className="w-full bg-background p-2 rounded-md border border-panel focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="border-t border-panel pt-4">
            <h4 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2"><ShieldCheckIcon className="h-5 w-5"/> Permissions</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(editedUser.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-background p-2 rounded-md">
                  <label className="text-text-primary capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handlePermissionChange(key as keyof UserPermission, e.target.checked)}
                    className="form-checkbox h-5 w-5 text-accent rounded bg-panel border-panel focus:ring-accent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Win/Loss Record */}
          <div className="border-t border-panel pt-4">
            <h4 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2"><ArrowPathIcon className="h-5 w-5"/> Win/Loss Record</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-text-secondary">Wins</label>
                <input
                  type="number"
                  value={editedUser.winLossRecord.wins}
                  onChange={(e) => handleWinLossChange('wins', parseInt(e.target.value) || 0)}
                  className="w-full bg-background p-2 rounded-md border border-panel focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"
                />
              </div>
              <div>
                <label className="block text-text-secondary">Losses</label>
                <input
                  type="number"
                  value={editedUser.winLossRecord.losses}
                  onChange={(e) => handleWinLossChange('losses', parseInt(e.target.value) || 0)}
                  className="w-full bg-background p-2 rounded-md border border-panel focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"
                />
              </div>
            </div>
          </div>

          {/* User Status */}
          <div className="border-t border-panel pt-4 flex items-center justify-between bg-background p-3 rounded-md">
            <h4 className="text-lg font-semibold text-accent flex items-center gap-2">User Status</h4>
            <button
              onClick={handleStatusChange}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                editedUser.isActive ? 'bg-positive hover:opacity-90 text-white' : 'bg-negative hover:opacity-90 text-white'
              }`}
            >
              {editedUser.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="bg-panel text-text-primary px-5 py-2 rounded-md hover:bg-background transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave(editedUser)} className="bg-accent text-background px-5 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};


interface MarketListingsSectionProps {
  marketItems: MarketItem[];
}
const MarketListingsSection: React.FC<MarketListingsSectionProps> = ({ marketItems }) => (
  <div>
    <h2 className="text-2xl font-bold text-accent mb-4">Market Listings Management</h2>
    <p className="mt-2 text-text-secondary">Content for managing marketplace listings goes here (e.g., approve new listings, remove inappropriate items).</p>
    
    <div className="overflow-x-auto bg-background rounded-lg border border-panel mt-4">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-panel text-text-secondary">
            <th className="p-3">Product</th>
            <th className="p-3">Seller</th>
            <th className="p-3 text-right">Price (USDT)</th>
            <th className="p-3 text-right">Stock</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {marketItems.map(item => (
            <tr key={item.id} className="border-t border-panel hover:bg-background">
              <td className="p-3 flex items-center gap-2">
                <img src={item.image} alt={item.name} className="h-8 w-8 rounded-md" />
                <span>{item.name}</span>
              </td>
              <td className="p-3">{item.seller}</td>
              <td className="p-3 text-right font-mono">{item.price.toLocaleString()}</td>
              <td className="p-3 text-right font-mono">{item.stock}</td>
              <td className="p-3 text-right">
                <button className="text-accent hover:opacity-80 p-1 rounded-md" title="Edit Product">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button className="text-negative hover:opacity-80 p-1 rounded-md ml-2" title="Delete Product">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SecuritySettingsSection: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-accent mb-4">Security Settings & Tools</h2>
    <p className="mt-2 text-text-secondary">Content for viewing security settings, managing MFA, IP whitelists, etc.</p>
     <div className="h-48 bg-background mt-4 rounded-md flex items-center justify-center text-text-secondary border border-panel">
      <p>Security configurations</p>
    </div>
  </div>
);

interface AdminActionsLogSectionProps {
  adminLogs: AdminLog[];
  compact?: boolean;
}

const AdminActionsLogSection: React.FC<AdminActionsLogSectionProps> = ({ adminLogs, compact = false }) => (
  <div>
    <h2 className={`font-bold text-accent ${compact ? 'text-xl' : 'text-2xl mb-4'}`}>Admin Actions Log</h2>
    {compact ? null : <p className="mt-2 text-text-secondary mb-4">All significant actions performed by administrators are recorded here.</p>}
    <div className="overflow-x-auto bg-background rounded-lg border border-panel">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-panel text-text-secondary">
            <th className="p-3">Timestamp</th>
            <th className="p-3">Admin ID</th>
            <th className="p-3">Action</th>
            <th className="p-3">Details</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {adminLogs.map((log) => (
            <tr key={log.id} className="border-t border-panel hover:bg-background">
              <td className="p-3 text-text-secondary font-mono">{log.timestamp}</td>
              <td className="p-3 text-accent font-mono">{log.adminId}</td>
              <td className="p-3 font-semibold">{log.action}</td>
              <td className="p-3 text-text-secondary">{log.details}</td>
              <td className={`p-3 font-medium ${log.status === 'Approved' ? 'text-positive' : log.status === 'Rejected' ? 'text-negative' : 'text-accent'}`}>
                {log.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

interface ChatMonitoringSectionProps {
  chatLogs: typeof mockChatLogs; // Using typeof to infer type from mock data
}

const ChatMonitoringSection: React.FC<ChatMonitoringSectionProps> = ({ chatLogs }) => (
  <div>
    <h2 className="text-2xl font-bold text-accent mb-4">Chat Monitoring & Management</h2>
    <p className="mt-2 text-text-secondary mb-4">Monitor user interactions with the AI assistant.</p>
    <div className="overflow-y-auto max-h-96 bg-background rounded-lg border border-panel p-4 space-y-4">
      {chatLogs.map((log) => (
        <div key={log.id} className="bg-panel p-3 rounded-md border border-background">
          <div className="flex justify-between items-center text-xs text-text-secondary mb-1">
            <span>{log.userName} (ID: {log.userId})</span>
            <span className="font-mono">{log.timestamp}</span>
          </div>
          <p className="text-text-primary text-sm">
            <span className="font-semibold text-accent">User:</span> {log.message}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            <span className="font-semibold text-positive">Bot:</span> {log.botResponse}
          </p>
        </div>
      ))}
      {chatLogs.length === 0 && (
        <p className="text-center text-text-secondary">No chat logs available.</p>
      )}
    </div>
  </div>
);

interface CustomerCreatorSectionProps {
  onCreateAccount: (account: CustomerAccount) => void;
  logAdminAction: (action: string, details: string, status?: AdminLog['status']) => void;
}

const CustomerCreatorSection: React.FC<CustomerCreatorSectionProps> = ({ onCreateAccount, logAdminAction }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [numAccounts, setNumAccounts] = useState(1);

  const handleCreateSingleAccount = () => {
    if (!customerName || !customerEmail || !customerPassword) {
      alert('Please fill all fields for single account creation.');
      return;
    }
    const newAccount: CustomerAccount = {
      id: `cust-${Date.now()}`,
      name: customerName,
      email: customerEmail,
      status: 'Active',
    };
    onCreateAccount(newAccount);
    logAdminAction('Create Single Customer Account', `Created account for ${customerName} (${customerEmail})`);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPassword('');
  };

  const handleCreateMultipleAccounts = () => {
    if (numAccounts <= 0 || !window.confirm(`Are you sure you want to create ${numAccounts} dummy customer accounts?`)) {
      return;
    }
    for (let i = 0; i < numAccounts; i++) {
      const id = `cust-${Date.now()}-${i}`;
      const name = `Customer ${i + 1} Batch`;
      const email = `batch_customer_${i+1}@cryptomall.io`;
      const newAccount: CustomerAccount = { id, name, email, status: 'Active' };
      onCreateAccount(newAccount);
    }
    logAdminAction('Create Multiple Customer Accounts', `Created ${numAccounts} dummy customer accounts`);
    setNumAccounts(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-accent mb-4">Customer Account Creator</h2>
      <p className="mt-2 text-text-secondary mb-4">Create new customer accounts for marketplace testing or onboarding.</p>

      {/* Single Account Creation */}
      <div className="bg-background p-5 rounded-lg border border-panel mb-6">
        <h3 className="text-xl font-semibold text-text-primary mb-3">Create Single Account</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-text-secondary text-sm mb-1">Full Name</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Full Name" className="w-full bg-panel p-2 rounded-md border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-1">Email</label>
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@example.com" className="w-full bg-panel p-2 rounded-md border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-1">Password</label>
            <input type="password" value={customerPassword} onChange={(e) => setCustomerPassword(e.target.value)} placeholder="Secure Password" className="w-full bg-panel p-2 rounded-md border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
          </div>
          <button onClick={handleCreateSingleAccount} className="w-full bg-accent text-background font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity mt-2">
            Create Customer Account
          </button>
        </div>
      </div>

      {/* Multiple Accounts Creation */}
      <div className="bg-background p-5 rounded-lg border border-panel">
        <h3 className="text-xl font-semibold text-text-primary mb-3">Create Multiple Accounts (Dummy)</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-text-secondary text-sm mb-1">Number of Accounts</label>
            <input type="number" value={numAccounts} onChange={(e) => setNumAccounts(parseInt(e.target.value) || 1)} min="1" max="100" className="w-full bg-panel p-2 rounded-md border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono" />
          </div>
          <button onClick={handleCreateMultipleAccounts} className="w-full bg-accent text-background font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity mt-2">
            Generate Dummy Accounts
          </button>
        </div>
      </div>
    </div>
  );
};

interface MarketplaceOrderManagementSectionProps {
  users: User[];
  customerAccounts: CustomerAccount[];
  marketItems: MarketItem[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  logAdminAction: (action: string, details: string, status?: AdminLog['status']) => void;
}

const MarketplaceOrderManagementSection: React.FC<MarketplaceOrderManagementSectionProps> = ({ 
  users, 
  customerAccounts, 
  marketItems, 
  orders, 
  setOrders, 
  logAdminAction 
}) => {
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('');
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [message, setMessage] = useState('');

  const availableBuyers = [...users, ...customerAccounts.map(c => ({ ...c, name: c.name + ' (Customer)' }))];
  const availableSellers = users.filter(u => u.permissions.canSell);
  const selectedProduct = marketItems.find(item => item.id === selectedProductId);

  const handleCreateOrder = () => {
    if (!selectedBuyerId || !selectedSellerId || !selectedProductId || !selectedProduct || !shippingAddress || quantity <= 0) {
      alert('Please fill all required fields and select a valid product/buyer/seller.');
      return;
    }

    const buyerInfo = availableBuyers.find(b => b.id === selectedBuyerId);
    const sellerInfo = availableSellers.find(s => s.id === selectedSellerId);

    if (!buyerInfo || !sellerInfo || quantity > selectedProduct.stock) {
      alert('Invalid buyer, seller, or insufficient product stock.');
      return;
    }

    const newOrder: Order = {
      id: `CM-ADMIN-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      status: 'Pending',
      buyer: buyerInfo.name,
      buyerId: buyerInfo.id,
      seller: sellerInfo.name,
      sellerId: sellerInfo.id,
      shippingAddress: shippingAddress,
      message: message,
      products: [{ itemId: selectedProduct.id, name: selectedProduct.name, qty: quantity, price: selectedProduct.price }],
      total: selectedProduct.price * quantity,
    };

    if (window.confirm(`Are you sure you want to create this order for ${buyerInfo.name} from ${sellerInfo.name}?`)) {
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      // Optional: update stock for marketItems if this were a real system (not just mock)
      logAdminAction('Create Marketplace Order', `Admin created order ${newOrder.id} for buyer ${buyerInfo.name} from seller ${sellerInfo.name}.`, 'Approved');
      
      // Reset form
      setSelectedBuyerId('');
      setSelectedSellerId('');
      setSelectedProductId('');
      setQuantity(1);
      setShippingAddress('');
      setMessage('');
    } else {
      logAdminAction('Create Marketplace Order Attempt', 'Admin cancelled order creation.', 'Rejected');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-accent mb-4">Marketplace Order Management</h2>
      <p className="mt-2 text-text-secondary mb-4">Manually create new orders for any buyer from any seller's store.</p>

      <div className="bg-background p-5 rounded-lg border border-panel mb-6">
        <h3 className="text-xl font-semibold text-text-primary mb-3">Create New Order</h3>
        <div className="space-y-3 text-sm">
          {/* Buyer Selector */}
          <div>
            <label className="block text-text-secondary mb-1">Buyer</label>
            <select
              value={selectedBuyerId}
              onChange={(e) => setSelectedBuyerId(e.target.value)}
              className="w-full bg-panel p-2 rounded-md border border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">-- Select Buyer --</option>
              {availableBuyers.map(buyer => (
                <option key={buyer.id} value={buyer.id}>{buyer.name} ({buyer.id.startsWith('cust-') ? 'Customer' : 'User'})</option>
              ))}
            </select>
          </div>

          {/* Seller Selector */}
          <div>
            <label className="block text-text-secondary mb-1">Seller (has canSell permission)</label>
            <select
              value={selectedSellerId}
              onChange={(e) => setSelectedSellerId(e.target.value)}
              className="w-full bg-panel p-2 rounded-md border border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">-- Select Seller --</option>
              {availableSellers.map(seller => (
                <option key={seller.id} value={seller.id}>{seller.name}</option>
              ))}
            </select>
          </div>

          {/* Product Selector */}
          <div>
            <label className="block text-text-secondary mb-1">Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-panel p-2 rounded-md border border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">-- Select Product --</option>
              {marketItems.map(item => (
                <option key={item.id} value={item.id}>{item.name} (Seller: {item.seller}) - {item.price} USDT (Stock: {item.stock})</option>
              ))}
            </select>
          </div>
          
          {/* Quantity */}
          <div>
            <label className="block text-text-secondary mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              max={selectedProduct ? selectedProduct.stock : 1}
              className="w-full bg-panel p-2 rounded-md border border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono"
            />
             {selectedProduct && quantity > selectedProduct.stock && (
                <p className="text-negative text-xs mt-1">Quantity exceeds available stock ({selectedProduct.stock}).</p>
            )}
          </div>

          {/* Shipping Address */}
          <div>
            <label className="block text-text-secondary mb-1">Shipping Address</label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Full shipping address"
              rows={2}
              className="w-full bg-panel p-2 rounded-md border border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            ></textarea>
          </div>

          {/* Message */}
          <div>
            <label className="block text-text-secondary mb-1">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message for seller"
              rows={1}
              className="w-full bg-panel p-2 rounded-md border border-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            ></textarea>
          </div>

          <div className="p-3 bg-panel rounded-md text-center border border-background">
             <p className="text-sm text-text-secondary">Total Order Price</p>
             <p className="text-2xl font-bold font-mono">{selectedProduct ? (selectedProduct.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} USDT</p>
         </div>

          <button onClick={handleCreateOrder} className="w-full bg-accent text-background font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity mt-2">
            Create Order
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-accent mb-3">Existing Marketplace Orders</h3>
        <div className="overflow-x-auto bg-background rounded-lg border border-panel">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-panel text-text-secondary">
                <th className="p-3">Order ID</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t border-panel hover:bg-background">
                  <td className="p-3 font-semibold font-mono">{order.id}</td>
                  <td className="p-3">{order.buyer}</td>
                  <td className="p-3">{order.seller}</td>
                  <td className="p-3 font-mono">{order.total.toLocaleString()} USDT</td>
                  <td className="p-3">
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
                  <td className="p-3 text-right text-text-secondary font-mono">{order.date}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="p-3 text-center text-text-secondary">No orders created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default AdminPanelPage;