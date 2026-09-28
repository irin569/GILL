import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  Ban,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  Wallet,
  Star,
  Edit2,
  X,
  Save,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { User, UserRole } from '../../types';
import { formatTHB, formatDate } from '../../utils/formatters';

export const AdminCustomers: React.FC = () => {
  const { users, updateUserById } = useAuth();
  const { orders, logAuditAction } = useStore();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Edit User Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('customer');
  const [editWallet, setEditWallet] = useState<number>(0);
  const [editPoints, setEditPoints] = useState<number>(0);
  const [editIsBanned, setEditIsBanned] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getUserTotalSpent = (userId: string) => {
    return orders
      .filter(o => o.userId === userId && o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.total, 0);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPhone(u.phone || '');
    setEditRole(u.role);
    setEditWallet(u.walletBalance || 0);
    setEditPoints(u.points || 0);
    setEditIsBanned(!!u.isBanned);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserById(editingUser.id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      role: editRole,
      walletBalance: Number(editWallet),
      points: Number(editPoints),
      isBanned: editIsBanned,
    });

    logAuditAction('Edit Customer Data', `${editName} (${editEmail}) - Role: ${editRole}`);
    setEditingUser(null);
  };

  const handleToggleBan = (u: User) => {
    updateUserById(u.id, { isBanned: !u.isBanned });
    logAuditAction('Toggle Ban Customer', `${u.name} - Status: ${!u.isBanned ? 'Banned' : 'Active'}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า, อีเมล, หรือเบอร์โทรศัพท์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2"
        >
          <option value="all">ทุกระดับผู้ใช้ (All Roles)</option>
          <option value="customer">Customer (ลูกค้า)</option>
          <option value="staff">Staff (เจ้าหน้าที่)</option>
          <option value="admin">Admin (ผู้ดูแลระบบ)</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">สมาชิก (User)</th>
                <th className="py-3 px-4">ระดับ (Role)</th>
                <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3 px-4">กระเป๋าเงิน (Wallet)</th>
                <th className="py-3 px-4">แต้มสะสม</th>
                <th className="py-3 px-4">ยอดซื้อสะสม</th>
                <th className="py-3 px-4">สถานะบัญชี</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredUsers.map(u => {
                const totalSpent = getUserTotalSpent(u.id);
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {totalSpent > 3000 && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                                VIP
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'super_admin'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : u.role === 'staff'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{u.phone || '-'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                      {formatTHB(u.walletBalance || 0)}
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-bold">{u.points || 0} PTS</td>
                    <td className="py-3 px-4 font-display font-bold text-white">{formatTHB(totalSpent)}</td>
                    <td className="py-3 px-4">
                      {u.isBanned ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                          <Ban className="w-3.5 h-3.5" /> ระงับการใช้งาน
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> ปกติ
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="แก้ไขข้อมูลลูกค้า"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                        {u.role !== 'super_admin' && (
                          <button
                            onClick={() => handleToggleBan(u)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${
                              u.isBanned
                                ? 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800'
                                : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800'
                            }`}
                          >
                            {u.isBanned ? 'ปลดแบน' : 'ระงับ'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Customer Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0f121e] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                แก้ไขข้อมูลสมาชิก: {editingUser.name}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              <div>
                <label className="block text-slate-400 mb-1">ชื่อ-นามสกุล / นามแฝง</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">อีเมล</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ระดับบทบาท (Role)</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="customer">Customer (ลูกค้า)</option>
                  <option value="staff">Staff (เจ้าหน้าที่)</option>
                  <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ยอดเงินคงเหลือในกระเป๋า (฿)</label>
                  <input
                    type="number"
                    value={editWallet}
                    onChange={(e) => setEditWallet(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">แต้มสะสม (Points)</label>
                  <input
                    type="number"
                    value={editPoints}
                    onChange={(e) => setEditPoints(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editIsBanned}
                    onChange={(e) => setEditIsBanned(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <span className="text-rose-400 font-semibold">ระงับการใช้งานบัญชีนี้ (Ban User)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกการแก้ไข</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
