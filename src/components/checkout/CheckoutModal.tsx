import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Receipt
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod, Order } from '../../types';
import { formatTHB } from '../../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewMyOrders: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onViewMyOrders,
}) => {
  const { cart, cartSubtotal, cartTotalDiscount, createOrder } = useStore();
  const { currentUser } = useAuth();

  const selectedItems = cart.filter(i => i.selected);
  const finalTotal = Math.max(0, cartSubtotal - cartTotalDiscount);

  // Form states
  const [name, setName] = useState(currentUser?.name || 'ลูกค้าทั่วไป');
  const [email, setEmail] = useState(currentUser?.email || 'customer@gamestore.local');
  const [phone, setPhone] = useState(currentUser?.phone || '081-234-5678');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('PromptPay');

  // Credit card form state
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Checkout progress
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePay = async () => {
    if (!name || !email || !phone) {
      setErrorMessage('กรุณากรอกข้อมูลผู้รับสินค้าและอีเมลให้ครบถ้วน');
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);

    // Simulate payment gateway delay (e.g. 1.2s)
    setTimeout(async () => {
      const res = await createOrder(selectedMethod, {
        name,
        email,
        phone,
      });
      setIsProcessing(false);
      if (res.success && res.order) {
        setCompletedOrder(res.order);
      } else {
        setErrorMessage(res.message || 'เกิดข้อผิดพลาดในการประมวลผลคำสั่งซื้อ');
      }
    }, 1200);
  };

  const handleResetAndClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f121e] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                {completedOrder ? 'คำสั่งซื้อสำเร็จ & รับคีย์ทันที' : 'ชำระเงินและรับสินค้าทันที'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {completedOrder ? `หมายเลขคำสั่งซื้อ #${completedOrder.id}` : 'ระบบส่งมอบ Digital Game Key อัตโนมัติ 24 ชม.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Success Screen with Immediate Key Delivery */}
          {completedOrder ? (
            <div className="space-y-6 animate-in zoom-in-95">
              
              {/* Success Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-2xl text-white tracking-wide mb-1">
                  ชำระเงินสำเร็จแล้ว!
                </h3>
                <p className="text-xs text-slate-300">
                  ระบบได้ออกรหัส Game Key แท้และส่งไปยังอีเมล <strong className="text-emerald-300">{completedOrder.customerEmail}</strong> เรียบร้อย
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-mono text-slate-400">
                  <span>Ref: {completedOrder.transactionRef}</span>
                  <span>•</span>
                  <span>ยอดชำระ: {formatTHB(completedOrder.total)}</span>
                </div>
              </div>

              {/* Game Keys Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  รหัสสินค้าดิจิทัลของคุณ (Digital License Keys):
                </h4>

                {completedOrder.items.map(item => (
                  <div key={item.productId} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={item.coverImage} alt="" className="w-10 h-7 rounded object-cover" />
                        <div>
                          <span className="text-xs font-bold text-white block">{item.productName}</span>
                          <span className="text-[10px] text-cyan-400 font-semibold">{item.platform}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">จำนวน: {item.quantity}</span>
                    </div>

                    {/* Key Strings List */}
                    <div className="space-y-2 pt-1">
                      {item.deliveredKeys && item.deliveredKeys.map((keyStr, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-cyan-500/40 shadow-inner"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">KEY #{idx + 1}:</span>
                            <span className="font-mono font-black text-sm text-cyan-300 tracking-wider select-all">
                              {keyStr}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopyKey(keyStr)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs transition-all"
                          >
                            {copiedKey === keyStr ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>คัดลอกแล้ว!</span>
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
                  </div>
                ))}
              </div>

              {/* Activation Instructions */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <span className="font-bold text-slate-200 block">💡 วิธีเปิดใช้งานรหัส (Activation Guide):</span>
                <p>• <strong>Steam:</strong> เปิดโปรแกรม Steam &rarr; เมนูด้านบน "Games" &rarr; "Activate a Product on Steam..." แล้ววางรหัส</p>
                <p>• <strong>Epic Games:</strong> เปิด Epic Launcher &rarr; คลิกโปรไฟล์มุมบนขวา &rarr; เลือก "Redeem Code"</p>
                <p>• <strong>PlayStation:</strong> เข้า PlayStation Store &rarr; เลือกไอคอนจุดสามจุด &rarr; "Redeem Codes"</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    handleResetAndClose();
                    onViewMyOrders();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>ดูในประวัติสั่งซื้อ (My Orders)</span>
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  กลับสู่หน้าร้าน
                </button>
              </div>

            </div>
          ) : (
            /* Checkout Steps (Customer info + Payment Method) */
            <div className="space-y-6">

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Digital Delivery Info */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center">1</span>
                  ข้อมูลจัดส่งสินค้าดิจิทัล (Digital Delivery)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">ชื่อผู้รับ</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">เบอร์โทรศัพท์ (SMS)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      อีเมลสำหรับรับ Game Key <strong className="text-cyan-400">(สำคัญ)</strong>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center">2</span>
                  เลือกช่องทางชำระเงิน
                </h4>

                {/* Gateway Selector Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('PromptPay')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedMethod === 'PromptPay'
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mb-2 text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold text-white">PromptPay QR</div>
                      <div className="text-[10px] text-slate-400">ฟรีค่าธรรมเนียม</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('CreditCard')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedMethod === 'CreditCard'
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-2 text-indigo-400" />
                    <div>
                      <div className="text-xs font-bold text-white">บัตรเครดิต/เดบิต</div>
                      <div className="text-[10px] text-slate-400">Visa / Mastercard</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('BankTransfer')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedMethod === 'BankTransfer'
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-2 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">โอนผ่านธนาคาร</div>
                      <div className="text-[10px] text-slate-400">กสิกร / SCB</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Wallet')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedMethod === 'Wallet'
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wallet className="w-5 h-5 mb-2 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">TrueMoney / Wallet</div>
                      <div className="text-[10px] text-slate-400">กระเป๋าเงินดิจิทัล</div>
                    </div>
                  </button>
                </div>

                {/* Sub-form based on Payment Method */}
                {selectedMethod === 'PromptPay' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col items-center text-center space-y-3">
                    <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4" /> สแกนด้วยแอปธนาคารทุกแห่ง (Thai QR Payment)
                    </div>
                    {/* Simulated PromptPay QR Graphic */}
                    <div className="p-3 bg-white rounded-2xl shadow-xl">
                      <svg
                        className="w-40 h-40"
                        viewBox="0 0 100 100"
                        fill="black"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Realistic Mock QR Pattern */}
                        <rect x="0" y="0" width="100" height="100" fill="white" />
                        <rect x="10" y="10" width="24" height="24" fill="black" />
                        <rect x="14" y="14" width="16" height="16" fill="white" />
                        <rect x="18" y="18" width="8" height="8" fill="black" />

                        <rect x="66" y="10" width="24" height="24" fill="black" />
                        <rect x="70" y="14" width="16" height="16" fill="white" />
                        <rect x="74" y="18" width="8" height="8" fill="black" />

                        <rect x="10" y="66" width="24" height="24" fill="black" />
                        <rect x="14" y="70" width="16" height="16" fill="white" />
                        <rect x="18" y="74" width="8" height="8" fill="black" />

                        <rect x="42" y="12" width="6" height="10" fill="black" />
                        <rect x="52" y="18" width="8" height="6" fill="black" />
                        <rect x="40" y="40" width="20" height="20" fill="black" />
                        <rect x="45" y="45" width="10" height="10" fill="white" />
                        <rect x="48" y="48" width="4" height="4" fill="black" />
                        <rect x="20" y="45" width="8" height="8" fill="black" />
                        <rect x="72" y="45" width="12" height="6" fill="black" />
                        <rect x="45" y="72" width="16" height="12" fill="black" />
                        <rect x="70" y="70" width="18" height="18" fill="black" />
                        <rect x="75" y="75" width="8" height="8" fill="white" />
                      </svg>
                    </div>
                    <div className="text-xs text-slate-300">
                      ยอดชำระ: <strong className="text-cyan-400 font-display text-base">{formatTHB(finalTotal)}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>QR Code มีอายุ 15 นาที • ระบบตรวจยอดอัตโนมัติ</span>
                    </div>
                  </div>
                )}

                {selectedMethod === 'CreditCard' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">หมายเลขบัตร (Card Number)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">วันหมดอายุ (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      🛡 มาตรฐานความปลอดภัย PCI DSS ไม่มีการบันทึกเลขบัตรเครดิตเต็มรูปแบบในฐานข้อมูล
                    </p>
                  </div>
                )}

                {selectedMethod === 'BankTransfer' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-white">ธนาคารกสิกรไทย (KBANK)</div>
                      <div className="font-mono text-cyan-400 text-sm mt-0.5">123-4-56789-0</div>
                      <div className="text-[10px] text-slate-400">ชื่อบัญชี: บจก. เกมสโตร์ ดิจิทัล แพลตฟอร์ม</div>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      * หลังโอนเงิน ระบบจะตรวจสอบยอดผ่าน API อัตโนมัติใน 10 วินาที
                    </div>
                  </div>
                )}

                {selectedMethod === 'Wallet' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <label className="block text-[11px] text-slate-400">เบอร์โทรศัพท์ TrueMoney Wallet</label>
                    <input
                      type="tel"
                      defaultValue="081-234-5678"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <p className="text-[10px] text-slate-500">ระบบจะส่งรหัส OTP ยืนยันการตัดยอดกระเป๋าเงิน</p>
                  </div>
                )}
              </div>

              {/* Order Summary & Pay Button */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>รวมรายการสินค้า ({selectedItems.length} รายการ)</span>
                  <span>{formatTHB(cartSubtotal)}</span>
                </div>
                {cartTotalDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                    <span>ส่วนลดคูปอง</span>
                    <span>-{formatTHB(cartTotalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>ยอดชำระสุทธิ</span>
                  <span className="font-display text-2xl text-cyan-400">{formatTHB(finalTotal)}</span>
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {isProcessing ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>กำลังประมวลผลการชำระเงินและออกคีย์...</span>
                    </>
                  ) : (
                    <>
                      <span>ยืนยันการชำระเงิน & รับคีย์ทันที</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
