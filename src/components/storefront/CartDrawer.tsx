import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Tag,
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatTHB } from '../../utils/formatters';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateCartQuantity,
    toggleCartSelection,
    clearCart,
    cartSubtotal,
    cartTotalDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getProductStock
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const selectedItems = cart.filter(i => i.selected);
  const finalTotal = Math.max(0, cartSubtotal - cartTotalDiscount);

  const handleApplyCoupon = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    const code = customCode || couponInput;
    if (!code.trim()) return;

    const res = applyCoupon(code);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f121e] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">ตะกร้าสินค้า</h3>
                <p className="text-[11px] text-slate-400">
                  {cart.length > 0 ? `${cart.length} รายการในตะกร้า` : 'ตะกร้าว่างเปล่า'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-950/30 transition-colors"
                >
                  ล้างตะกร้า
                </button>
              )}
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-800/80">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mb-3">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="text-white font-bold text-sm mb-1">ยังไม่มีสินค้าในตะกร้า</h4>
                <p className="text-xs text-slate-400 mb-6">เลือกซื้อคีย์เกมที่คุณต้องการได้จากหน้าร้าน</p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  เลือกดูเกมทั้งหมด
                </button>
              </div>
            ) : (
              cart.map(item => {
                const stock = getProductStock(item.product.id);
                return (
                  <div key={item.product.id} className="py-3.5 flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleCartSelection(item.product.id)}
                      className="mt-2 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500 h-4 w-4 cursor-pointer"
                    />

                    {/* Image */}
                    <img
                      src={item.product.coverImage}
                      alt={item.product.name}
                      className="w-16 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 truncate" title={item.product.name}>
                        {item.product.name}
                      </h4>
                      <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                        {item.product.platform} • {item.product.region}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= stock}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xs font-display font-black text-cyan-400">
                            {formatTHB(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="ลบออกจากตะกร้า"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout Panel */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/90 space-y-4">
              
              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-emerald-300">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">
                          (ลด {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `฿${appliedCoupon.discountValue}`})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] text-rose-400 hover:underline font-semibold"
                    >
                      ยกเลิก
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="กรอกโค้ดส่วนลด..."
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 uppercase focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-colors"
                      >
                        ใช้โค้ด
                      </button>
                    </div>

                    {/* Quick suggested coupons */}
                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[10px]">
                      <span className="text-slate-500 shrink-0">โค้ดแนะนำ:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, 'GAME2026')}
                        className="px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800 text-indigo-300 hover:bg-indigo-900"
                      >
                        GAME2026 (-20%)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, 'WELCOME10')}
                        className="px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800 text-indigo-300 hover:bg-indigo-900"
                      >
                        WELCOME10 (-10%)
                      </button>
                    </div>

                    {couponError && <div className="text-[11px] text-rose-400">{couponError}</div>}
                    {couponSuccess && <div className="text-[11px] text-emerald-400">{couponSuccess}</div>}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>ยอดรวมสินค้า ({selectedItems.length} รายการที่เลือก)</span>
                  <span>{formatTHB(cartSubtotal)}</span>
                </div>
                {cartTotalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>ส่วนลดคูปอง</span>
                    <span>-{formatTHB(cartTotalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>ค่าบริการจัดส่งดิจิทัล</span>
                  <span className="text-emerald-400">ฟรี (ทันที 24 ชม.)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>ยอดชำระสุทธิ</span>
                  <span className="font-display text-xl text-cyan-400">{formatTHB(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  if (selectedItems.length === 0) return;
                  setIsCartDrawerOpen(false);
                  onProceedToCheckout();
                }}
                disabled={selectedItems.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>ชำระเงิน ({selectedItems.length} รายการ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>ชำระเงินปลอดภัย ผ่าน PromptPay และบัตรเครดิต</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
