import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Eye,
  Key,
  CreditCard,
  User as UserIcon,
  X,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatTHB, formatDate } from '../../utils/formatters';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, refundOrder } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Refund dialog
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.transactionRef.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !refundReason.trim()) return;
    refundOrder(selectedOrder.id, refundReason.trim());
    setIsRefunding(false);
    setRefundReason('');
    setSelectedOrder(prev => prev ? { ...prev, status: 'Refunded', paymentStatus: 'Refunded' } : null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ค้นหา Order ID, ชื่อลูกค้า, อีเมล, Ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 cursor-pointer"
          >
            <option value="all">ทุกสถานะ (All Status)</option>
            <option value="Pending">Pending (รอดำเนินการ)</option>
            <option value="Paid">Paid (ชำระแล้ว)</option>
            <option value="Delivered">Delivered (ส่งคีย์แล้ว)</option>
            <option value="Completed">Completed (สมบูรณ์)</option>
            <option value="Refunded">Refunded (คืนเงิน)</option>
            <option value="Cancelled">Cancelled (ยกเลิก)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">ลูกค้า (Customer)</th>
                <th className="py-3 px-4">รายการสินค้า</th>
                <th className="py-3 px-4">ยอดรวมสุทธิ</th>
                <th className="py-3 px-4">ช่องทาง / Ref</th>
                <th className="py-3 px-4">สถานะ (Status)</th>
                <th className="py-3 px-4 text-right">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    ไม่พบรายการคำสั่งซื้อตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-cyan-400">#{order.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-[10px] text-slate-500">{order.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium">{order.items.length} รายการ</span>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {order.items.map(i => i.productName).join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-display font-bold text-white">
                      {formatTHB(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-semibold">{order.paymentMethod}</div>
                      <div className="text-[10px] font-mono text-slate-500">{order.transactionRef}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered' || order.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : order.status === 'Refunded'
                          ? 'bg-purple-950 text-purple-400 border border-purple-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>เปิดดู</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Manager Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0f121e] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  รายละเอียดคำสั่งซื้อ #{selectedOrder.id}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  วันที่: {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Customer & Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">ข้อมูลลูกค้า</span>
                  <div className="font-bold text-white text-sm">{selectedOrder.customerName}</div>
                  <div className="text-slate-400 mt-0.5">{selectedOrder.customerEmail}</div>
                  <div className="text-slate-400">{selectedOrder.customerPhone}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">การชำระเงิน</span>
                  <div className="text-slate-200 font-semibold">{selectedOrder.paymentMethod}</div>
                  <div className="font-mono text-cyan-400 mt-0.5">Ref: {selectedOrder.transactionRef}</div>
                  <div className="text-emerald-400 font-bold mt-1">
                    สถานะการชำระ: {selectedOrder.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Items & Delivered Keys */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  สินค้าในคำสั่งซื้อ & Game Keys ที่จัดส่งแล้ว:
                </h4>
                {selectedOrder.items.map(item => (
                  <div key={item.productId} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={item.coverImage} alt="" className="w-10 h-7 rounded object-cover" />
                        <div>
                          <div className="font-bold text-white">{item.productName}</div>
                          <div className="text-[10px] text-cyan-400">{item.platform} • จำนวน: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-bold text-white">{formatTHB(item.price * item.quantity)}</div>
                    </div>

                    {item.deliveredKeys && item.deliveredKeys.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30 space-y-1">
                        <span className="text-[10px] text-cyan-400 font-bold block">รหัส Game Key:</span>
                        {item.deliveredKeys.map(k => (
                          <div key={k} className="font-mono font-bold text-cyan-300 text-xs">
                            {k}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>ยอดรวมสินค้า</span>
                  <span>{formatTHB(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>ส่วนลด (โค้ด: {selectedOrder.couponCode || '-'})</span>
                    <span>-{formatTHB(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>ยอดสุทธิ</span>
                  <span className="font-display font-black text-lg text-cyan-400">{formatTHB(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Status Update & Refund Handler */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  เปลี่ยนสถานะคำสั่งซื้อ (Update Order Status)
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {(['Pending', 'Paid', 'Delivered', 'Completed', 'Cancelled'] as OrderStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedOrder.status === st
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                  
                  {selectedOrder.status !== 'Refunded' && (
                    <button
                      onClick={() => setIsRefunding(!isRefunding)}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-semibold hover:bg-rose-900/60"
                    >
                      คืนเงิน (Refund)
                    </button>
                  )}
                </div>

                {isRefunding && (
                  <form onSubmit={handleRefundSubmit} className="pt-2 border-t border-slate-800 space-y-2">
                    <label className="block text-[11px] text-rose-300 font-semibold">
                      ระบุเหตุผลในการคืนเงิน (Refund Reason):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น ลูกค้าสั่งซื้อผิดเกม, คีย์มีปัญหา..."
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full bg-slate-950 border border-rose-800 rounded-xl px-3 py-2 text-white text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsRefunding(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        ยืนยันการคืนเงิน
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
