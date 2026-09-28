import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, KeyRound, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  onSuccess?: () => void;
  onAdminLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onAdminLoginSuccess }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalTab, setAuthModalTab } = useStore();
  const { login, register, forgotPassword, switchDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setError(null);
    setSuccessMsg(null);
    setIsAuthModalOpen(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('กรุณากรอกอีเมล');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const ok = login(email, authModalTab === 'admin' ? 'admin' : 'customer');
      if (ok) {
        handleClose();
        if (authModalTab === 'admin') {
          onAdminLoginSuccess?.();
        } else {
          onSuccess?.();
        }
      } else {
        setError('ไม่พบบัญชีผู้ใช้ หรือบัญชีนี้ถูกระงับการใช้งาน');
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !phone) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const ok = register(name, email, phone);
      if (ok) {
        setSuccessMsg('สมัครสมาชิกสำเร็จ ยินดีต้อนรับสู่ GAME STORE!');
        setTimeout(() => {
          handleClose();
          onSuccess?.();
        }, 1000);
      } else {
        setError('อีเมลนี้ถูกใช้งานแล้วในระบบ');
      }
    }, 500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('กรุณากรอกอีเมลที่ใช้สมัครสมาชิก');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      forgotPassword(email);
      setSuccessMsg(`ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} แล้ว (โหมดจำลอง)`);
    }, 500);
  };

  const handleQuickDemo = (role: UserRole) => {
    switchDemoUser(role);
    handleClose();
    if (role === 'admin' || role === 'super_admin' || role === 'staff') {
      onAdminLoginSuccess?.();
    } else {
      onSuccess?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#111422] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            {authModalTab === 'admin' ? (
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-cyan-400" />
              </div>
            )}
            <h3 className="font-display font-bold text-lg text-white">
              {authModalTab === 'admin'
                ? 'เข้าสู่ระบบ Admin / Staff'
                : authModalTab === 'register'
                ? 'สมัครสมาชิกใหม่'
                : authModalTab === 'forgot'
                ? 'กู้คืนรหัสผ่าน'
                : 'เข้าสู่ระบบ GAME STORE'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 px-6 pt-2">
          <button
            onClick={() => { setAuthModalTab('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all ${
              authModalTab === 'login'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ลูกค้า (Login)
          </button>
          <button
            onClick={() => { setAuthModalTab('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all ${
              authModalTab === 'register'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            สมัครสมาชิก
          </button>
          <button
            onClick={() => { setAuthModalTab('admin'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all ${
              authModalTab === 'admin'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin / Staff
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Customer / Admin Login */}
          {(authModalTab === 'login' || authModalTab === 'admin') && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {authModalTab === 'admin' && (
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 leading-tight">
                  🔒 พื้นที่สำหรับทีมงาน Admin & Staff เท่านั้น เพื่อเข้าถึงแดชบอร์ดหลังบ้าน
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  อีเมล (Email)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder={
                      authModalTab === 'admin'
                        ? 'superadmin@gamestore.local'
                        : 'vip@gamestore.local'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">รหัสผ่าน (Password)</label>
                  {authModalTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthModalTab('forgot')}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      ลืมรหัสผ่าน?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  authModalTab === 'admin'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>เข้าสู่ระบบ</span>
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ชื่อ-นามสกุล / ชื่อในเกม</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="เช่น ศักดิ์สิทธิ์ สุขใจ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">อีเมล (สำหรับรับ Game Key)</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">เบอร์โทรศัพท์ (SMS แจ้งเตือน)</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="081-234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">รหัสผ่าน</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
              >
                ยืนยันการสมัครสมาชิก
              </button>
            </form>
          )}

          {/* Forgot Password */}
          {authModalTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-slate-400">
                กรอกอีเมลของคุณ ระบบจะส่งคำแนะนำการตั้งรหัสผ่านใหม่ให้ทันที
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">อีเมลของคุณ</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white rounded-xl"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl"
                >
                  ส่งลิงก์รีเซ็ต
                </button>
              </div>
            </form>
          )}

          {/* Quick 1-Click Demo Accounts Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>คลิกเดียวเข้าสู่ระบบด้วยบัญชีทดสอบ (1-Click Demo):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('super_admin')}
                className="p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/50 text-left transition-colors"
              >
                <div className="font-bold text-amber-300 text-[11px]">⚡ Super Admin</div>
                <div className="text-[10px] text-slate-400 truncate">superadmin@gamestore.local</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('staff')}
                className="p-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 text-left transition-colors"
              >
                <div className="font-bold text-blue-300 text-[11px]">🛠 Staff Backoffice</div>
                <div className="text-[10px] text-slate-400 truncate">staff@gamestore.local</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-left transition-colors"
              >
                <div className="font-bold text-emerald-300 text-[11px]">🎮 VIP Customer</div>
                <div className="text-[10px] text-slate-400 truncate">vip@gamestore.local</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  login('user@gamestore.local', 'customer');
                  handleClose();
                  onSuccess?.();
                }}
                className="p-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 text-left transition-colors"
              >
                <div className="font-bold text-purple-300 text-[11px]">👤 Regular Customer</div>
                <div className="text-[10px] text-slate-400 truncate">user@gamestore.local</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
