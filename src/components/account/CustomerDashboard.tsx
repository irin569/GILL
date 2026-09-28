import React, { useState } from 'react';
import {
  User as UserIcon,
  ShoppingBag,
  Key,
  Heart,
  Tag,
  Wallet,
  Star,
  LifeBuoy,
  Shield,
  Copy,
  Check,
  Plus,
  Send,
  ExternalLink,
  Receipt,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatTHB, formatDate } from '../../utils/formatters';
import { Product, SupportTicket } from '../../types';

interface CustomerDashboardProps {
  onSelectProduct: (product: Product) => void;
  onBackToStore: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onSelectProduct,
  onBackToStore,
}) => {
  const { currentUser, updateProfile, changePassword, logout } = useAuth();
  const {
    orders,
    wishlist,
    products,
    coupons,
    reviews,
    tickets,
    createTicket,
    replyTicket,
    addToCart,
    setIsCartDrawerOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'keys' | 'wishlist' | 'coupons' | 'wallet' | 'reviews' | 'support' | 'security'
  >('overview');

  // Copy Key state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Profile Edit state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password Edit state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  // New Support Ticket state
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('Technical');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('Medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketReplyInput, setTicketReplyInput] = useState<Record<string, string>>({});

  // Filter user specific data
  const userOrders = orders.filter(
    o => o.userId === currentUser?.id || o.customerEmail === currentUser?.email
  );

  // Aggregate all keys owned by this user
  const userDeliveredKeys: {
    productName: string;
    platform: string;
    keyString: string;
    orderId: string;
    deliveredAt?: string;
  }[] = [];

  userOrders.forEach(o => {
    o.items.forEach(item => {
      if (item.deliveredKeys && item.deliveredKeys.length > 0) {
        item.deliveredKeys.forEach(k => {
          userDeliveredKeys.push({
            productName: item.productName,
            platform: item.platform,
            keyString: k,
            orderId: o.id,
            deliveredAt: o.deliveredAt || o.createdAt,
          });
        });
      }
    });
  });

  const userWishlistProducts = products.filter(p => wishlist.includes(p.id));
  const userReviews = reviews.filter(r => r.userId === currentUser?.id);
  const userTickets = tickets.filter(t => t.userId === currentUser?.id || t.userEmail === currentUser?.email);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: editName, phone: editPhone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword(oldPassword, newPassword);
    setOldPassword('');
    setNewPassword('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    createTicket(ticketSubject, ticketCategory, ticketMessage, ticketPriority);
    setTicketSubject('');
    setTicketMessage('');
    setIsCreatingTicket(false);
  };

  const handleSendTicketReply = (ticketId: string) => {
    const text = ticketReplyInput[ticketId];
    if (!text?.trim()) return;
    replyTicket(ticketId, text.trim());
    setTicketReplyInput(prev => ({ ...prev, [ticketId]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      
      {/* Top Breadcrumb & User Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#111425] to-[#0d101d] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl text-white tracking-wide">
                {currentUser?.name || 'ลูกค้าทั่วไป'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-700">
                {currentUser?.role === 'super_admin' ? 'Super Admin' : currentUser?.role === 'staff' ? 'Staff' : 'VIP Member'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Wallet Balance Card */}
          <div className="p-3 px-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">ยอดเงินคงเหลือ</span>
            <span className="font-display font-black text-lg text-cyan-400">
              {formatTHB(currentUser?.walletBalance || 0)}
            </span>
          </div>

          {/* Points Card */}
          <div className="p-3 px-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-right">
            <span className="text-[10px] text-amber-300/80 uppercase font-bold block">แต้มสะสม</span>
            <span className="font-display font-black text-lg text-amber-400">
              {currentUser?.points || 0} PTS
            </span>
          </div>

          <button
            onClick={onBackToStore}
            className="hidden sm:inline-block px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            กลับสู่หน้าร้าน
          </button>
        </div>
      </div>

      {/* Main Grid (Sidebar Nav + Tab View) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserIcon className="w-4 h-4" />
              <span>ภาพรวม (Overview)</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>คำสั่งซื้อของฉัน</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'orders' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {userOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'keys'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4" />
              <span>คลัง Game Keys</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'keys' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {userDeliveredKeys.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>สิ่งที่อยากได้ (Wishlist)</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'wishlist' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {userWishlistProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'coupons'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4" />
              <span>คูปองส่วนลด</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'coupons' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {coupons.filter(c => c.isActive).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'wallet'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4" />
              <span>กระเป๋าเงินและแต้ม</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'reviews'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>รีวิวของฉัน</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'reviews' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {userReviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'support'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LifeBuoy className="w-4 h-4" />
              <span>บริการช่วยเหลือ (Tickets)</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'support' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {userTickets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4" />
              <span>ความปลอดภัย & ข้อมูลส่วนตัว</span>
            </div>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="lg:col-span-3">

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400">คำสั่งซื้อทั้งหมด</span>
                  <div className="font-display font-black text-2xl text-white mt-1">
                    {userOrders.length} ครั้ง
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400">คีย์เกมที่ถือครอง</span>
                  <div className="font-display font-black text-2xl text-cyan-400 mt-1">
                    {userDeliveredKeys.length} คีย์
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400">รายการที่อยากได้</span>
                  <div className="font-display font-black text-2xl text-pink-400 mt-1">
                    {userWishlistProducts.length} เกม
                  </div>
                </div>
              </div>

              {/* Latest Delivered Key Highlight */}
              {userDeliveredKeys.length > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> คีย์ล่าสุดที่คุณได้รับ
                    </span>
                    <button
                      onClick={() => setActiveTab('keys')}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      ดูทั้งหมด &rarr;
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-cyan-500/20">
                    <div>
                      <div className="font-bold text-white text-xs">{userDeliveredKeys[0].productName}</div>
                      <div className="font-mono text-cyan-300 font-bold text-sm tracking-wider mt-0.5">
                        {userDeliveredKeys[0].keyString}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyKey(userDeliveredKeys[0].keyString)}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      {copiedKey === userDeliveredKeys[0].keyString ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> <span>คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> <span>คัดลอกคีย์</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Orders List */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-white">คำสั่งซื้อล่าสุด</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-cyan-400 hover:underline">
                    ดูทั้งหมด
                  </button>
                </div>
                {userOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">ยังไม่มีประวัติคำสั่งซื้อ</p>
                ) : (
                  <div className="space-y-3">
                    {userOrders.slice(0, 3).map(order => (
                      <div key={order.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">#{order.id}</div>
                          <div className="text-[11px] text-slate-400">{formatDate(order.createdAt)} • {order.items.length} รายการ</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-cyan-400">{formatTHB(order.total)}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 2. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white mb-2">ประวัติการสั่งซื้อทั้งหมด</h3>
              {userOrders.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">ยังไม่มีรายการสั่งซื้อ</p>
                </div>
              ) : (
                userOrders.map(order => (
                  <div key={order.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="font-bold text-sm text-white">คำสั่งซื้อ #{order.id}</div>
                        <div className="text-[11px] text-slate-400">
                          วันที่: {formatDate(order.createdAt)} • ช่องทาง: {order.paymentMethod}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {order.status}
                        </span>
                        <span className="font-display font-black text-lg text-cyan-400">
                          {formatTHB(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.productId} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.coverImage} alt="" className="w-12 h-8 rounded object-cover" />
                            <div>
                              <div className="font-bold text-slate-200">{item.productName}</div>
                              <div className="text-[10px] text-cyan-400">{item.platform} • จำนวน: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="font-bold text-white">{formatTHB(item.price * item.quantity)}</div>
                        </div>
                      ))}
                    </div>

                    {/* Keys in Order */}
                    {order.items.some(i => i.deliveredKeys && i.deliveredKeys.length > 0) && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs space-y-1.5">
                        <span className="text-[11px] font-bold text-cyan-400 block">Game Keys ในออเดอร์นี้:</span>
                        {order.items.map(i =>
                          i.deliveredKeys?.map(k => (
                            <div key={k} className="flex items-center justify-between font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                              <span className="text-slate-300 font-bold">{k}</span>
                              <button
                                onClick={() => handleCopyKey(k)}
                                className="text-cyan-400 hover:underline text-[11px]"
                              >
                                {copiedKey === k ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. GAME KEYS TAB */}
          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-white">คลัง Game Keys ดิจิทัล</h3>
                <span className="text-xs text-slate-400">รวม {userDeliveredKeys.length} คีย์</span>
              </div>

              {userDeliveredKeys.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                  <Key className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">ยังไม่มีคีย์เกมในคลังของคุณ</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {userDeliveredKeys.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{item.productName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            {item.platform}
                          </span>
                        </div>
                        <div className="font-mono font-black text-sm text-cyan-300 tracking-wider mt-1 select-all">
                          {item.keyString}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          ออเดอร์ #{item.orderId}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyKey(item.keyString)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md"
                      >
                        {copiedKey === item.keyString ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>คัดลอกเรียบร้อย!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>คัดลอกคีย์</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white mb-2">สิ่งที่อยากได้ (Wishlist)</h3>
              {userWishlistProducts.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                  <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">ยังไม่มีสินค้าในสิ่งที่อยากได้</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userWishlistProducts.map(prod => (
                    <div key={prod.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3">
                      <img src={prod.coverImage} alt="" className="w-20 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                          <span className="text-[10px] text-cyan-400">{prod.platform}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-display font-bold text-cyan-400 text-sm">{formatTHB(prod.price)}</span>
                          <button
                            onClick={() => {
                              addToCart(prod, 1);
                              setIsCartDrawerOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px]"
                          >
                            ใส่ตะกร้า
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white mb-2">คูปองส่วนลดที่มี</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map(coup => (
                  <div
                    key={coup.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#121629] border border-indigo-500/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-black text-sm text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                          {coup.code}
                        </span>
                        <span className="text-xs font-bold text-rose-400">
                          {coup.discountType === 'percentage' ? `ลด ${coup.discountValue}%` : `ลด ฿${coup.discountValue}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{coup.description}</p>
                      <div className="text-[10px] text-slate-500">
                        ขั้นต่ำ: ฿{coup.minSpend} • ใช้ได้ถึง: {coup.endDate}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyKey(coup.code)}
                      className="mt-4 w-full py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-colors"
                    >
                      {copiedKey === coup.code ? 'คัดลอกโค้ดแล้ว' : 'คัดลอกโค้ด'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. WALLET & POINTS TAB */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="text-xs text-slate-400 uppercase font-bold">ยอดเงินในกระเป๋า</span>
                  <div className="font-display font-black text-3xl text-cyan-400">
                    {formatTHB(currentUser?.walletBalance || 0)}
                  </div>
                  <p className="text-[11px] text-slate-400">ใช้หักชำระค่าเกมได้ทันที ไม่ต้องกรอกบัตร</p>
                </div>

                <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-3">
                  <span className="text-xs text-amber-300 uppercase font-bold">แต้มสะสม (Game Points)</span>
                  <div className="font-display font-black text-3xl text-amber-400">
                    {currentUser?.points || 0} แต้ม
                  </div>
                  <p className="text-[11px] text-slate-400">ทุก 100 แต้ม = ส่วนลด ฿10 ในการซื้อครั้งถัดไป</p>
                </div>
              </div>
            </div>
          )}

          {/* 7. REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white mb-2">รีวิวสินค้าที่คุณเคยเขียน</h3>
              {userReviews.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                  <Star className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">คุณยังไม่เคยส่งรีวิวสินค้า</p>
                </div>
              ) : (
                userReviews.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-bold">สินค้า ID: {r.productId}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-200">{r.comment}</p>
                    <div className="text-[10px] text-slate-500">{formatDate(r.createdAt)}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 8. SUPPORT TICKETS TAB */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white">บริการช่วยเหลือ & แจ้งปัญหา (Tickets)</h3>
                <button
                  onClick={() => setIsCreatingTicket(!isCreatingTicket)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>เปิด Ticket ใหม่</span>
                </button>
              </div>

              {/* Create Ticket Form */}
              {isCreatingTicket && (
                <form onSubmit={handleCreateTicketSubmit} className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">สร้างคำร้องใหม่</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">หัวข้อเรื่อง</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น ปัญหาการ Redeem คีย์บน Steam..."
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">หมวดหมู่</label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Game Key Issue">ปัญหา Game Key</option>
                        <option value="Payment & Refund">การชำระเงินและคืนเงิน</option>
                        <option value="Technical">ปัญหาทางเทคนิค</option>
                        <option value="Account">บัญชีผู้ใช้</option>
                        <option value="General">สอบถามทั่วไป</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">รายละเอียดปัญหา</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="อธิบายข้อความ Error หรือรายละเอียดคำถาม..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingTicket(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                    >
                      ส่งคำร้อง
                    </button>
                  </div>
                </form>
              )}

              {/* Tickets List */}
              <div className="space-y-4">
                {userTickets.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                    <LifeBuoy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">ไม่มีคำร้องหรือ Ticket ที่รอดำเนินการ</p>
                  </div>
                ) : (
                  userTickets.map(t => (
                    <div key={t.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">#{t.id} - {t.subject}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {t.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{formatDate(t.createdAt)}</span>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                          t.status === 'Answered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>

                      {/* Chat Messages */}
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {t.messages.map(m => (
                          <div
                            key={m.id}
                            className={`p-3 rounded-xl text-xs max-w-[85%] ${
                              m.sender === 'user'
                                ? 'bg-cyan-950/60 border border-cyan-800/40 text-slate-200 ml-auto'
                                : 'bg-slate-950 border border-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center justify-between gap-4">
                              <span>{m.senderName}</span>
                              <span>{formatDate(m.timestamp)}</span>
                            </div>
                            <p>{m.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input */}
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <input
                          type="text"
                          placeholder="พิมพ์ข้อความตอบกลับ..."
                          value={ticketReplyInput[t.id] || ''}
                          onChange={(e) => setTicketReplyInput({ ...ticketReplyInput, [t.id]: e.target.value })}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <button
                          onClick={() => handleSendTicketReply(t.id)}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>ส่ง</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 9. SECURITY & PROFILE TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Profile Details Form */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">แก้ไขข้อมูลส่วนตัว</h4>
                {profileSaved && (
                  <div className="text-xs text-emerald-400">บันทึกข้อมูลส่วนตัวสำเร็จ!</div>
                )}
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">ชื่อ-นามสกุล / นามแฝงในเกม</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                    >
                      บันทึกโปรไฟล์
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Change Form */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">เปลี่ยนรหัสผ่าน (Change Password)</h4>
                {passwordSaved && (
                  <div className="text-xs text-emerald-400">เปลี่ยนรหัสผ่านเรียบร้อย!</div>
                )}
                <form onSubmit={handleSavePassword} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">รหัสผ่านปัจจุบัน</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">รหัสผ่านใหม่</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                    >
                      อัปเดตรหัสผ่าน
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
