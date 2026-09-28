import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Check,
  X,
  Calendar,
  Percent,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon, Category } from '../../types';
import { formatTHB } from '../../utils/formatters';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponActive } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minSpend, setMinSpend] = useState<number>(500);
  const [maxDiscount, setMaxDiscount] = useState<number>(300);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  // Delete confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinSpend(500);
    setMaxDiscount(300);
    setUsageLimit(100);
    setStartDate('2026-01-01');
    setEndDate('2026-12-31');
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinSpend(coupon.minSpend);
    setMaxDiscount(coupon.maxDiscount || 0);
    setUsageLimit(coupon.usageLimit);
    setStartDate(coupon.startDate);
    setEndDate(coupon.endDate);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        minSpend: Number(minSpend),
        maxDiscount: discountType === 'percentage' && Number(maxDiscount) > 0 ? Number(maxDiscount) : undefined,
        usageLimit: Number(usageLimit),
        startDate,
        endDate,
      });
    } else {
      addCoupon({
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        minSpend: Number(minSpend),
        maxDiscount: discountType === 'percentage' && Number(maxDiscount) > 0 ? Number(maxDiscount) : undefined,
        usageLimit: Number(usageLimit),
        startDate,
        endDate,
        isActive: true,
        applicableCategory: 'All',
      });
    }

    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleDelete = (id: string) => {
    deleteCoupon(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-pink-400" />
            <span>จัดการคูปอง & แคมเปญส่วนลด (Marketing & Coupons)</span>
          </h2>
          <p className="text-xs text-slate-400">สร้าง แก้ไข กำหนดเงื่อนไข และเปิด/ปิดโค้ดโปรโมชั่นของร้าน</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างคูปองใหม่ (Create Coupon)</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <div
            key={coupon.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              coupon.isActive
                ? 'bg-slate-900/80 border-slate-700/80'
                : 'bg-slate-950/40 border-slate-800/60 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-black text-sm text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800">
                  {coupon.code}
                </span>
                <span className={`text-xs font-bold ${coupon.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {coupon.isActive ? '● เปิดใช้งาน' : '○ ปิดใช้งาน'}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white mb-1">{coupon.description}</h4>

              <div className="space-y-1.5 text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>ส่วนลด:</span>
                  <strong className="text-emerald-400">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatTHB(coupon.discountValue)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>ยอดสั่งซื้อขั้นต่ำ:</span>
                  <strong className="text-white">{formatTHB(coupon.minSpend)}</strong>
                </div>
                {coupon.maxDiscount && (
                  <div className="flex justify-between">
                    <span>ลดสูงสุด:</span>
                    <strong className="text-white">{formatTHB(coupon.maxDiscount)}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>สิทธิ์การใช้งาน:</span>
                  <strong className="text-amber-400">{coupon.usedCount} / {coupon.usageLimit} ครั้ง</strong>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>ระยะเวลา:</span>
                  <span className="text-slate-500">{coupon.startDate} ~ {coupon.endDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(coupon)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                  title="แก้ไขคูปอง"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">แก้ไข</span>
                </button>

                {deleteConfirmId === coupon.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                    >
                      ยืนยัน
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="p-1 rounded bg-slate-800 text-slate-300 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(coupon.id)}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs"
                    title="ลบคูปองนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => toggleCouponActive(coupon.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  coupon.isActive
                    ? 'bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 border border-rose-900/40'
                    : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-900/40'
                }`}
              >
                {coupon.isActive ? 'ปิดการใช้งาน' : 'เปิดใช้งาน'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0f121e] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                {editingCoupon ? `แก้ไขคูปอง ${editingCoupon.code}` : 'สร้างคูปองส่วนลดใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">รหัสคูปอง (Coupon Code)</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น SUMMER2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">คำอธิบายโปรโมชั่น</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ลดทันที 15% ฉลองรับซัมเมอร์"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ประเภทส่วนลด</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="percentage">เปอร์เซ็นต์ (%)</option>
                    <option value="fixed">จำนวนเงินคงที่ (฿)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">มูลค่าส่วนลด</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ยอดสั่งซื้อขั้นต่ำ (฿)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ลดสูงสุด (฿ - ไม่ระบุใส่ 0)</label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    disabled={discountType === 'fixed'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white disabled:opacity-40 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">จำนวนสิทธิ์การใช้</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">วันสิ้นสุดโปรโมชั่น</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                >
                  {editingCoupon ? 'บันทึกการแก้ไข' : 'สร้างคูปอง'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
