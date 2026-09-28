import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  HelpCircle,
  Tag,
  Zap,
  Bell,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatTHB } from '../../utils/formatters';

interface NavbarProps {
  currentView: 'store' | 'account' | 'admin' | 'faq';
  setCurrentView: (view: 'store' | 'account' | 'admin' | 'faq') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { currentUser, logout, switchDemoUser, isStaff, isAdmin } = useAuth();
  const {
    cartItemCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    wishlist,
    setIsAuthModalOpen,
    setAuthModalTab,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('store');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e17]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/60 border-b border-indigo-500/20 text-xs py-1 px-4 text-center text-indigo-200 flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>ระบบจัดส่งคีย์อัตโนมัติ 24 ชม. รับคีย์ทันทีหลังชำระเงิน | คูปองลด 20% โค้ด: <strong className="text-amber-300 font-mono">GAME2026</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('store')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <div className="w-full h-full bg-[#0d101d] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="font-display font-bold text-xl tracking-wider text-white flex items-center gap-1.5">
                  GAME<span className="text-cyan-400">STORE</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase -mt-1">
                  Digital Platform
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => { setCurrentView('store'); setSelectedCategory('All'); }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentView === 'store' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                หน้าแรก
              </button>
              <button
                onClick={() => { setCurrentView('store'); setSelectedCategory('Game Key'); }}
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                เกม PC/Steam
              </button>
              <button
                onClick={() => { setCurrentView('store'); setSelectedCategory('Gift Card'); }}
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-1"
              >
                <Tag className="w-3.5 h-3.5 text-pink-400" />
                Gift Card
              </button>
              <button
                onClick={() => { setCurrentView('store'); setSelectedCategory('Game Top-up'); }}
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                เติมเกม
              </button>
              <button
                onClick={() => setCurrentView('faq')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentView === 'faq' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                ช่วยเหลือ/FAQ
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ค้นหาชื่อเกม, SKU, แพลตฟอร์ม (เช่น Cyberpunk, Steam, FC 25)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 border border-slate-700/70 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Admin Backoffice Button */}
            <button
              onClick={() => {
                if (isStaff) {
                  setCurrentView('admin');
                } else {
                  switchDemoUser('super_admin');
                  setCurrentView('admin');
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-600/20 hover:from-amber-500 hover:to-amber-600 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-slate-950 transition-all shadow-md group"
              title="เปิดระบบจัดการหลังบ้าน & แดชบอร์ด (แก้ไขได้)"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:text-slate-950 transition-colors" />
              <span className="hidden sm:inline">ระบบหลังบ้าน</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-black tracking-wide group-hover:bg-slate-950 group-hover:text-amber-400 transition-colors">
                ADMIN
              </span>
            </button>

            {/* Quick Demo Role Switcher Badge */}
            <div className="relative">
              <button
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 transition-all"
                title="สลับบัญชีทดสอบระบบ"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {currentUser?.role === 'super_admin'
                    ? '⚡ Super Admin'
                    : currentUser?.role === 'staff'
                    ? '🛠 Staff'
                    : currentUser?.role === 'customer'
                    ? '🎮 Customer (VIP)'
                    : '👤 Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-indigo-400" />
              </button>

              {isDemoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    สลับบทบาททดสอบ (Demo Switcher)
                  </div>
                  <button
                    onClick={() => { switchDemoUser('super_admin'); setIsDemoDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-indigo-600/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-amber-400">Super Admin (สมชาย)</div>
                      <div className="text-[10px] text-slate-400">สิทธิ์สูงสุดทุกเมนูหลังบ้าน</div>
                    </div>
                    {currentUser?.role === 'super_admin' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => { switchDemoUser('staff'); setIsDemoDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-indigo-600/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-blue-400">Staff (ณัฐพงษ์)</div>
                      <div className="text-[10px] text-slate-400">จัดการสินค้า, ออเดอร์, คีย์</div>
                    </div>
                    {currentUser?.role === 'staff' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => { switchDemoUser('customer'); setIsDemoDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-indigo-600/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-emerald-400">VIP Customer (ธนากร)</div>
                      <div className="text-[10px] text-slate-400">ลูกค้ามีประวัติซื้อและคีย์เกม</div>
                    </div>
                    {currentUser?.role === 'customer' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => { switchDemoUser('guest'); setIsDemoDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div>Guest (ยังไม่ล็อกอิน)</div>
                    {!currentUser && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
                aria-label="การแจ้งเตือน"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-[#0c0e17] animate-ping" />
                )}
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-[#0c0e17]" />
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-300">การแจ้งเตือนล่าสุด</span>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        อ่านทั้งหมด
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">ไม่มีการแจ้งเตือน</div>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs hover:bg-slate-800/60 cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="font-semibold text-slate-200">{n.title}</div>
                          <div className="text-slate-400 mt-0.5">{n.message}</div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {new Date(n.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (!currentUser) {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                } else {
                  setCurrentView('account');
                }
              }}
              className="relative p-2 rounded-xl text-slate-300 hover:text-pink-400 hover:bg-slate-800 transition-colors focus:outline-none"
              title="สิ่งที่อยากได้"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white transition-all focus:outline-none"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">
                {formatTHB(cartSubtotal)}
              </span>
            </button>

            {/* User Account / Admin Switch */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all focus:outline-none"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/50"
                  />
                  <span className="hidden md:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800">
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-slate-200">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                          {currentUser.role}
                        </span>
                        <span className="text-[11px] text-amber-400 font-medium">
                          {currentUser.points} แต้ม
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { setCurrentView('account'); setIsUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-cyan-400" />
                        บัญชีของฉัน (My Account)
                      </button>

                      {isStaff && (
                        <button
                          onClick={() => { setCurrentView('admin'); setIsUserDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-left text-xs text-amber-300 hover:bg-amber-950/30 flex items-center gap-2 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          หลังบ้าน (Admin Backoffice)
                        </button>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { logout(); setIsUserDropdownOpen(false); setCurrentView('store'); }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/20 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setAuthModalTab('login'); setIsAuthModalOpen(true); }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-all"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={() => { setAuthModalTab('register'); setIsAuthModalOpen(true); }}
                  className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <input
              type="text"
              placeholder="ค้นหาชื่อเกม, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-sm text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-3 py-2 border border-slate-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => { setCurrentView('store'); setSelectedCategory('All'); setIsMobileMenuOpen(false); }}
              className="p-2 text-left bg-slate-800/60 rounded-lg text-slate-200"
            >
              🎮 หน้าแรก
            </button>
            <button
              onClick={() => { setCurrentView('store'); setSelectedCategory('Game Key'); setIsMobileMenuOpen(false); }}
              className="p-2 text-left bg-slate-800/60 rounded-lg text-slate-200"
            >
              🔑 คีย์เกม PC/Steam
            </button>
            <button
              onClick={() => { setCurrentView('store'); setSelectedCategory('Gift Card'); setIsMobileMenuOpen(false); }}
              className="p-2 text-left bg-slate-800/60 rounded-lg text-slate-200"
            >
              💳 Gift Card
            </button>
            <button
              onClick={() => { setCurrentView('store'); setSelectedCategory('Game Top-up'); setIsMobileMenuOpen(false); }}
              className="p-2 text-left bg-slate-800/60 rounded-lg text-slate-200"
            >
              💎 เติมเกม
            </button>
          </div>

          <button
            onClick={() => {
              if (isStaff) {
                setCurrentView('admin');
              } else {
                switchDemoUser('super_admin');
                setCurrentView('admin');
              }
              setIsMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-2 px-3 text-xs font-bold text-center text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/50 rounded-xl flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>เข้าสู่ระบบหลังบ้าน (Admin Backoffice & แก้ไขแดชบอร์ด)</span>
          </button>
        </div>
      )}
    </header>
  );
};
