import React, { useState } from 'react';
import {
  Key,
  Plus,
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Filter,
  AlertCircle,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeyStatus } from '../../types';
import { formatDate } from '../../utils/formatters';

interface AdminKeysProps {
  initialProductId?: string;
}

export const AdminKeys: React.FC<AdminKeysProps> = ({ initialProductId }) => {
  const { products, gameKeys, addKey, bulkImportKeys, toggleKeyStatus } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || (products[0]?.id || '')
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Single key add
  const [newSingleKey, setNewSingleKey] = useState('');
  const [singleKeyError, setSingleKeyError] = useState<string | null>(null);
  const [singleKeySuccess, setSingleKeySuccess] = useState<string | null>(null);

  // Bulk import
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResult, setBulkResult] = useState<{ added: number; duplicates: number } | null>(null);

  // Copied string feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Filter keys
  const filteredKeys = gameKeys.filter(k => {
    const matchProduct = selectedProductId === 'all' || k.productId === selectedProductId;
    const matchStatus = statusFilter === 'all' || k.status === statusFilter;
    const matchSearch = k.keyString.toLowerCase().includes(search.toLowerCase()) ||
                        k.productName.toLowerCase().includes(search.toLowerCase()) ||
                        (k.orderId && k.orderId.toLowerCase().includes(search.toLowerCase()));
    return matchProduct && matchStatus && matchSearch;
  });

  const availableCount = gameKeys.filter(k => (selectedProductId === 'all' || k.productId === selectedProductId) && k.status === 'available').length;
  const soldCount = gameKeys.filter(k => (selectedProductId === 'all' || k.productId === selectedProductId) && k.status === 'sold').length;

  const handleAddSingleKey = (e: React.FormEvent) => {
    e.preventDefault();
    setSingleKeyError(null);
    setSingleKeySuccess(null);
    if (!newSingleKey.trim()) return;

    const ok = addKey(selectedProductId, newSingleKey);
    if (ok) {
      setSingleKeySuccess(`เพิ่มคีย์ ${newSingleKey.toUpperCase()} สำเร็จ!`);
      setNewSingleKey('');
    } else {
      setSingleKeyError('คีย์นี้มีอยู่ในระบบแล้ว (ตรวจพบคีย์ซ้ำ)');
    }
  };

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;
    const res = bulkImportKeys(selectedProductId, bulkInput);
    setBulkResult(res);
    setBulkInput('');
  };

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopiedKey(str);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">คีย์พร้อมจำหน่าย (Available)</span>
          <div className="font-display font-black text-2xl text-cyan-400 mt-1">
            {availableCount} คีย์
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">คีย์ที่ขายและส่งมอบแล้ว (Sold)</span>
          <div className="font-display font-black text-2xl text-emerald-400 mt-1">
            {soldCount} คีย์
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">สินค้าที่กำลังเลือก</span>
          <div className="font-bold text-sm text-white mt-1 truncate">
            {selectedProduct?.name || 'แสดงทุกสินค้า'}
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        
        {/* Select Product & Filter Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">เลือกสินค้า</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 max-w-xs"
            >
              <option value="all">ทุกสินค้า (All Products)</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.platform})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">สถานะคีย์</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="available">พร้อมขาย (Available)</option>
              <option value="sold">ขายแล้ว (Sold)</option>
              <option value="revoked">ระงับ/ยกเลิก (Revoked)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">ค้นหา</label>
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหารหัสคีย์ หรือ Order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end">
          <button
            onClick={() => setIsBulkOpen(!isBulkOpen)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>นำเข้าหลายคีย์ (Bulk Import CSV)</span>
          </button>
        </div>

      </div>

      {/* Quick Add Single Key Bar */}
      {selectedProductId !== 'all' && (
        <form onSubmit={handleAddSingleKey} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs text-slate-300 font-semibold shrink-0">
            + เพิ่มคีย์เดี่ยวให้ {selectedProduct?.name}:
          </span>
          <input
            type="text"
            required
            placeholder="เช่น CP77-STEAM-XXXX-YYYY-ZZZZ"
            value={newSingleKey}
            onChange={(e) => setNewSingleKey(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
          >
            บันทึกคีย์
          </button>
        </form>
      )}

      {singleKeyError && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
          {singleKeyError}
        </div>
      )}
      {singleKeySuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs">
          {singleKeySuccess}
        </div>
      )}

      {/* Bulk Import Modal / Box */}
      {isBulkOpen && (
        <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              นำเข้ารหัส Game Keys แบบกลุ่ม (Bulk / CSV) ให้: {selectedProduct?.name || 'สินค้าที่เลือก'}
            </h4>
            <button
              onClick={() => setIsBulkOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ปิดหน้าต่าง
            </button>
          </div>

          <p className="text-xs text-slate-400">
            วางรหัสคีย์ทีละบรรทัด (1 บรรทัดต่อ 1 คีย์) ระบบจะตรวจสอบและคัดกรองคีย์ซ้ำให้อัตโนมัติ:
          </p>

          <form onSubmit={handleBulkImport} className="space-y-3">
            <textarea
              rows={4}
              required
              placeholder="ABCD-1234-EFGH-5678&#10;IJKL-9012-MNOP-3456&#10;QRST-7890-UVWX-1234"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl p-3 text-xs text-white font-mono"
            />

            {bulkResult && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1">
                <div className="text-emerald-400 font-bold">
                  ✓ เพิ่มคีย์ใหม่สำเร็จ: {bulkResult.added} คีย์
                </div>
                {bulkResult.duplicates > 0 && (
                  <div className="text-amber-400 font-bold">
                    ⚠️ ข้ามคีย์ซ้ำที่มีอยู่แล้ว: {bulkResult.duplicates} คีย์
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
              >
                เริ่มนำเข้าคีย์
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Keys Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">รหัสสินค้า / ชื่อเกม</th>
                <th className="py-3 px-4">Game Key Code</th>
                <th className="py-3 px-4">สถานะ (Status)</th>
                <th className="py-3 px-4">ออเดอร์ที่ซื้อ (Order ID)</th>
                <th className="py-3 px-4">วันที่นำเข้า / จำหน่าย</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    ไม่พบคีย์เกมตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filteredKeys.map(k => (
                  <tr key={k.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white max-w-xs truncate">
                      {k.productName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {k.keyString}
                        </span>
                        <button
                          onClick={() => handleCopy(k.keyString)}
                          className="text-slate-500 hover:text-white"
                          title="คัดลอก"
                        >
                          {copiedKey === k.keyString ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {k.status === 'available' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                          พร้อมขาย (Available)
                        </span>
                      ) : k.status === 'sold' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          ขายแล้ว (Sold)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                          ระงับ (Revoked)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {k.orderId ? (
                        <span className="text-cyan-400 font-semibold">#{k.orderId}</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {k.soldAt ? formatDate(k.soldAt) : formatDate(k.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {k.status === 'available' ? (
                        <button
                          onClick={() => toggleKeyStatus(k.id, 'revoked')}
                          className="px-2 py-1 rounded bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800 text-[10px] font-semibold"
                        >
                          ระงับคีย์
                        </button>
                      ) : k.status === 'revoked' ? (
                        <button
                          onClick={() => toggleKeyStatus(k.id, 'available')}
                          className="px-2 py-1 rounded bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-800 text-[10px] font-semibold"
                        >
                          เปิดใช้งาน
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[10px]">จำหน่ายแล้ว</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
