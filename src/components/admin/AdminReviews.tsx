import React, { useState } from 'react';
import {
  Star,
  Search,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2,
  MessageSquare,
  ShieldCheck,
  Send,
  X,
  AlertTriangle,
  ThumbsUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Review } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AdminReviews: React.FC = () => {
  const { reviews, products, moderateReview, replyToReview, deleteReview } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  // Replying state
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState<string | null>(null);

  // Delete confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getProductForReview = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const filteredReviews = reviews.filter(r => {
    const prod = getProductForReview(r.productId);
    const matchSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      (prod && prod.name.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchRating = ratingFilter === 'all' || r.rating === ratingFilter;

    return matchSearch && matchStatus && matchRating;
  });

  // Stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : '5.0';
  const publishedCount = reviews.filter(r => r.status === 'published').length;
  const hiddenCount = reviews.filter(r => r.status === 'hidden').length;
  const reportedCount = reviews.filter(r => r.status === 'reported').length;
  const verifiedCount = reviews.filter(r => r.isVerifiedPurchase).length;

  const handleOpenReply = (rev: Review) => {
    setReplyingReview(rev);
    setReplyText(rev.adminReply || '');
    setReplySuccess(null);
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview) return;
    replyToReview(replyingReview.id, replyText.trim());
    setReplySuccess('บันทึกคำตอบกลับรีวิวสำเร็จ!');
    setTimeout(() => {
      setReplyingReview(null);
      setReplySuccess(null);
    }, 1200);
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>การจัดการรีวิวจากลูกค้า (Customer Reviews Moderation)</span>
          </h2>
          <p className="text-xs text-slate-400">
            ตรวจสอบ อนุมัติ ซ่อน ลบ และตอบกลับความคิดเห็นของลูกค้าที่สั่งซื้อสินค้า
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>คะแนนเฉลี่ยรวม</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-display flex items-baseline gap-1">
            <span>{avgRating}</span>
            <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">จาก {totalReviews} ความคิดเห็น</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>เผยแพร่แล้ว (Published)</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-display">
            {publishedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {totalReviews > 0 ? Math.round((publishedCount / totalReviews) * 100) : 100}% ของทั้งหมด
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ผู้ซื้อจริง (Verified)</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-display">
            {verifiedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">มีประวัติสั่งซื้อในระบบ</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>รายงาน/ซ่อนไว้</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-display">
            {hiddenCount + reportedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {reportedCount} รายงาน, {hiddenCount} ถูกซ่อน
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า, ชื่อเกม หรือเนื้อหารีวิว..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'published' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              เผยแพร่
            </button>
            <button
              onClick={() => setStatusFilter('hidden')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'hidden' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ซ่อน
            </button>
            <button
              onClick={() => setStatusFilter('reported')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'reported' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              รายงาน
            </button>
          </div>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 cursor-pointer focus:outline-none"
          >
            <option value="all">⭐ ทุกดาว (All Stars)</option>
            <option value={5}>⭐⭐⭐⭐⭐ 5 ดาว</option>
            <option value={4}>⭐⭐⭐⭐ 4 ดาว</option>
            <option value={3}>⭐⭐⭐ 3 ดาว</option>
            <option value={2}>⭐⭐ 2 ดาว</option>
            <option value={1}>⭐ 1 ดาว</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-500 text-xs">
            ไม่พบรีวิวที่ตรงกับเงื่อนไขการค้นหา
          </div>
        ) : (
          filteredReviews.map(rev => {
            const prod = getProductForReview(rev.productId);
            return (
              <div
                key={rev.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  rev.status === 'hidden'
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : rev.status === 'reported'
                    ? 'bg-rose-950/10 border-rose-900/40'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  
                  {/* Left: Customer Info & Product Info */}
                  <div className="flex items-start gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={rev.userName}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-xs">{rev.userName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded-md">
                            <ShieldCheck className="w-3 h-3" />
                            <span>ผู้ซื้อจริง</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-amber-300 ml-1">{rev.rating}/5</span>
                      </div>

                      {/* Target Product Badge */}
                      {prod && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-cyan-400 font-medium">
                          <img src={prod.coverImage} alt="" className="w-4 h-4 rounded object-cover" />
                          <span>{prod.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({prod.platform})</span>
                        </div>
                      )}

                      {/* Comment text */}
                      <p className="text-xs text-slate-200 mt-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                        "{rev.comment}"
                      </p>

                      {/* Existing Admin Reply Display */}
                      {rev.adminReply && (
                        <div className="mt-2.5 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-indigo-300 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>คำตอบกลับจากร้านค้า (Staff Official Reply):</span>
                            {rev.adminReplyAt && (
                              <span className="text-[10px] text-slate-400 font-mono font-normal">
                                {formatDate(rev.adminReplyAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 leading-relaxed pl-5">
                            {rev.adminReply}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0 self-end sm:self-start">
                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        rev.status === 'published'
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                          : rev.status === 'hidden'
                          ? 'bg-slate-800 border border-slate-700 text-slate-300'
                          : 'bg-rose-950 border border-rose-800 text-rose-300'
                      }`}
                    >
                      {rev.status === 'published'
                        ? 'เผยแพร่อยู่'
                        : rev.status === 'hidden'
                        ? 'ถูกซ่อน'
                        : 'มีรายงาน'}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 mt-1">
                      {/* Reply Button */}
                      <button
                        onClick={() => handleOpenReply(rev)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="ตอบกลับรีวิวในนามร้านค้า"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{rev.adminReply ? 'แก้ไขคำตอบ' : 'ตอบกลับ'}</span>
                      </button>

                      {/* Toggle status */}
                      {rev.status !== 'published' ? (
                        <button
                          onClick={() => moderateReview(rev.id, 'published')}
                          className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-xs transition-colors"
                          title="อนุมัติ / เผยแพร่"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => moderateReview(rev.id, 'hidden')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-xs transition-colors"
                          title="ซ่อนรีวิวนี้"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      {deleteConfirmId === rev.id ? (
                        <div className="flex items-center gap-1 animate-in fade-in">
                          <button
                            onClick={() => handleDelete(rev.id)}
                            className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                          >
                            ยืนยัน
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 rounded-lg bg-slate-800 text-slate-300 text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(rev.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-400 text-xs transition-colors"
                          title="ลบรีวิวนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0f121e] border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">
                  ตอบกลับรีวิวของ {replyingReview.userName}
                </h3>
              </div>
              <button
                onClick={() => setReplyingReview(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer review summary */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">{replyingReview.userName}</span>
                <span className="text-amber-400 font-bold">⭐ {replyingReview.rating}/5</span>
              </div>
              <p className="text-slate-400 italic">"{replyingReview.comment}"</p>
            </div>

            {replySuccess && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{replySuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveReply} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ข้อความตอบกลับในนามร้านค้า GAME STORE Official:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="เช่น ขอบคุณสำหรับการสนับสนุนร้านเราครับ หากมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม สามารถติดต่อทีมงานได้ตลอด 24 ชม. ครับ..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>บันทึกคำตอบกลับ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
