import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, CreditCard, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useStore();
  const { currentUser } = useAuth();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold);
  const [pointsRate, setPointsRate] = useState(settings.pointsRate);

  const [enablePromptPay, setEnablePromptPay] = useState(settings.enablePromptPay);
  const [enableCreditCard, setEnableCreditCard] = useState(settings.enableCreditCard);
  const [enableBankTransfer, setEnableBankTransfer] = useState(settings.enableBankTransfer);
  const [enableWallet, setEnableWallet] = useState(settings.enableWallet);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      contactEmail,
      contactPhone,
      lowStockThreshold: Number(lowStockThreshold),
      pointsRate: Number(pointsRate),
      enablePromptPay,
      enableCreditCard,
      enableBankTransfer,
      enableWallet,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    resetAllData();
    setResetConfirmOpen(false);
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl text-xs">
      
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>บันทึกการตั้งค่าร้านค้าเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* General Store Settings Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            การตั้งค่าร้านค้าทั่วไป (General Store Settings)
          </h3>
          <p className="text-slate-400 text-xs">กำหนดข้อมูลร้านค้าและช่องทางติดต่อสำหรับลูกค้า</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">ชื่อร้านค้า (Store Name)</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">อีเมลติดต่อฝ่ายบริการ (Support Email)</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">เบอร์โทรศัพท์ร้าน</label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">เกณฑ์แจ้งเตือนคีย์เหลือน้อย (ชิ้น)</label>
            <input
              type="number"
              required
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        {/* Payment Gateways Toggle */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            เปิด/ปิด ช่องทางชำระเงินที่รองรับ
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200 font-semibold">Thai QR PromptPay</span>
              <input
                type="checkbox"
                checked={enablePromptPay}
                onChange={(e) => setEnablePromptPay(e.target.checked)}
                className="h-4 w-4 rounded text-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200 font-semibold">บัตรเครดิต/เดบิต (Visa/Mastercard)</span>
              <input
                type="checkbox"
                checked={enableCreditCard}
                onChange={(e) => setEnableCreditCard(e.target.checked)}
                className="h-4 w-4 rounded text-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200 font-semibold">โอนผ่านบัญชีธนาคาร (Bank Transfer)</span>
              <input
                type="checkbox"
                checked={enableBankTransfer}
                onChange={(e) => setEnableBankTransfer(e.target.checked)}
                className="h-4 w-4 rounded text-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200 font-semibold">TrueMoney / Digital Wallet</span>
              <input
                type="checkbox"
                checked={enableWallet}
                onChange={(e) => setEnableWallet(e.target.checked)}
                className="h-4 w-4 rounded text-amber-500"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>
      </form>

      {/* Role & Permissions Matrix */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          ตารางสิทธิ์การเข้าถึงตามบทบาท (Role & Permission Matrix)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-2.5 px-3">โมดูลระบบ</th>
                <th className="py-2.5 px-3">Super Admin</th>
                <th className="py-2.5 px-3">Admin</th>
                <th className="py-2.5 px-3">Staff</th>
                <th className="py-2.5 px-3">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2 px-3 font-semibold">จัดการสินค้า (Products CRUD)</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ เต็มรูปแบบ</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ เต็มรูปแบบ</td>
                <td className="py-2 px-3 text-cyan-400 font-bold">✓ ดู/แก้ไข</td>
                <td className="py-2 px-3 text-rose-500 font-bold">✕ ไม่มีสิทธิ์</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">คลัง Game Keys (Import/Add/Revoke)</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ เต็มรูปแบบ</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ เต็มรูปแบบ</td>
                <td className="py-2 px-3 text-cyan-400 font-bold">✓ นำเข้า/ดู</td>
                <td className="py-2 px-3 text-rose-500 font-bold">✕ ไม่มีสิทธิ์</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">คำสั่งซื้อ & การคืนเงิน (Orders & Refunds)</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ เต็มรูปแบบ</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ จัดการ/คืนเงิน</td>
                <td className="py-2 px-3 text-cyan-400 font-bold">✓ ตรวจสอบสถานะ</td>
                <td className="py-2 px-3 text-rose-500 font-bold">✕ ดูเฉพาะตนเอง</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">บันทึกการกระทำ (Audit Log)</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ เต็มรูปแบบ</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ ดูรายงาน</td>
                <td className="py-2 px-3 text-rose-500 font-bold">✕ ไม่มีสิทธิ์</td>
                <td className="py-2 px-3 text-rose-500 font-bold">✕ ไม่มีสิทธิ์</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">ตั้งค่าระบบร้านค้า & ฐานข้อมูล</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">✓ สิทธิ์สูงสุด</td>
                <td className="py-2 px-3 text-rose-500 font-bold">✕ ไม่มีสิทธิ์</td>
                <td className="py-2 px-3 text-rose-500 font-bold">✕ ไม่มีสิทธิ์</td>
                <td className="py-2 px-3 text-rose-500 font-bold">✕ ไม่มีสิทธิ์</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone: Reset Database */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/60 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5" />
          <span>รีเซ็ตข้อมูลตัวอย่าง (Reset Demo Seed Data)</span>
        </div>
        <p className="text-slate-400">
          หากต้องการคืนค่าข้อมูลเริ่มต้นทั้งหมด (สินค้า 12 รายการ, Game Keys ใหม่, บัญชีทดสอบ, ออเดอร์ตัวอย่าง) สามารถกดปุ่มด้านล่างเพื่อล้างข้อมูลใน LocalStorage
        </p>

        {resetConfirmOpen ? (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 space-y-3">
            <span className="text-rose-300 font-bold block">
              ⚠️ คุณแน่ใจหรือไม่ว่าต้องการคืนค่าระบบเป็นค่าเริ่มต้นทั้งหมด?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                ยืนยันการรีเซ็ตข้อมูล
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>คืนค่าข้อมูลจำลองเริ่มต้น</span>
          </button>
        )}
      </div>

    </div>
  );
};
