import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Key,
  ShoppingBag,
  Users,
  Tag,
  Star,
  LifeBuoy,
  FileText,
  Settings,
  ShieldCheck,
  Bell,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  onExitAdmin,
  children,
}) => {
  const { currentUser, logout, hasPermission } = useAuth();
  const { notifications, gameKeys, orders, tickets, products, settings } = useStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Badge counters
  const lowStockCount = products.filter(
    p => gameKeys.filter(k => k.productId === p.id && k.status === 'available').length <= settings.lowStockThreshold
  ).length;

  const pendingOrdersCount = orders.filter(
    o => o.status === 'Pending' || o.status === 'Awaiting Payment' || o.status === 'Processing'
  ).length;

  const openTicketsCount = tickets.filter(
    t => t.status === 'Open' || t.status === 'Pending'
  ).length;

  const menuItems = [
    { id: 'dashboard', label: 'ภาพรวม (Dashboard)', icon: LayoutDashboard, permission: 'reports.view' },
    { id: 'products', label: 'จัดการสินค้า (Products)', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} เตือนสต็อก` : undefined, badgeColor: 'bg-amber-500', permission: 'products.view' },
    { id: 'keys', label: 'คลัง Game Keys (Digital)', icon: Key, badge: `${gameKeys.filter(k => k.status === 'available').length} พร้อมขาย`, badgeColor: 'bg-cyan-600', permission: 'keys.view' },
    { id: 'orders', label: 'คำสั่งซื้อ (Orders)', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? String(pendingOrdersCount) : undefined, badgeColor: 'bg-rose-500', permission: 'orders.view' },
    { id: 'customers', label: 'สมาชิกลูกค้า (Customers)', icon: Users, permission: 'customers.view' },
    { id: 'coupons', label: 'คูปอง & โปรโมชั่น', icon: Tag, permission: 'coupons.manage' },
    { id: 'reviews', label: 'จัดการรีวิว (Reviews)', icon: Star, permission: 'reviews.manage' },
    { id: 'support', label: 'ตอบข้อความ Support', icon: LifeBuoy, badge: openTicketsCount > 0 ? String(openTicketsCount) : undefined, badgeColor: 'bg-blue-500', permission: 'tickets.manage' },
    { id: 'audit', label: 'บันทึกการกระทำ (Audit Log)', icon: FileText, permission: 'audit.view' },
    { id: 'settings', label: 'ตั้งค่าร้าน & สิทธิ์ (Settings)', icon: Settings, permission: 'settings.manage' },
  ];

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-white text-sm">GAME STORE Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0d101d] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-black text-sm text-white tracking-wider">BACKOFFICE</h2>
                <p className="text-[10px] text-amber-400 font-semibold uppercase">{currentUser?.role}</p>
              </div>
            </div>
            <button
              onClick={onExitAdmin}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="กลับสู่หน้าร้าน"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {menuItems.map(item => {
              if (item.permission && !hasPermission(item.permission)) {
                return null;
              }
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold text-white ${item.badgeColor || 'bg-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-500/40"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate max-w-[110px]">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-slate-400 capitalize">{currentUser?.role}</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onExitAdmin();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Backoffice Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Topbar Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">ADMINISTRATION SUITE</span>
            <h1 className="text-xl sm:text-2xl font-display font-black text-white capitalize">
              {menuItems.find(m => m.id === activeTab)?.label || 'ภาพรวมระบบ'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>ดูหน้าร้าน (Storefront)</span>
            </button>
          </div>
        </div>

        {/* Injected Tab Body */}
        {children}
      </main>

    </div>
  );
};
