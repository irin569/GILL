import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Heart,
  Cpu,
  ShieldCheck,
  Zap,
  Tag,
  Share2,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatTHB } from '../../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  const {
    getProductStock,
    addToCart,
    setIsCartDrawerOpen,
    wishlist,
    toggleWishlist,
    getProductReviews,
    addReview,
    products
  } = useStore();
  const { currentUser } = useAuth();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'reviews'>('info');

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!product) return null;

  const stock = getProductStock(product.id);
  const isWish = wishlist.includes(product.id);
  const reviews = getProductReviews(product.id);
  const screenshots = product.screenshots && product.screenshots.length > 0
    ? [product.coverImage, ...product.screenshots]
    : [product.coverImage];

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.platform === product.platform))
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const ok = addReview(product.id, reviewRating, reviewComment.trim());
    if (ok) {
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#111422] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              SKU: {product.sku}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              {product.platform}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Main Showcase (Gallery + Key Specs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gallery Column */}
            <div>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-3 shadow-inner">
                <img
                  src={screenshots[activeImageIdx] || product.coverImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {screenshots.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {screenshots.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-20 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIdx === idx ? 'border-cyan-400 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info & Buy Box Column */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-500">({product.reviewCount} รีวิว)</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">Region: <strong className="text-slate-200">{product.region}</strong></span>
                </div>

                <h1 className="font-display font-black text-2xl text-white tracking-wide mb-2 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {product.tagline}
                </p>

                {/* Stock Status Pill */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-300">สถานะสต็อกคีย์:</span>
                  </div>
                  {stock > 0 ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      พร้อมจัดส่งอัตโนมัติ ({stock} คีย์)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      หมดชั่วคราว
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {product.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA Panel */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-400">ราคาพิเศษ</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-black text-3xl text-cyan-400">
                        {formatTHB(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-slate-500 line-through text-sm">
                          {formatTHB(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.discountPercent > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-md">
                      ประหยัด {product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`col-span-1 p-3 rounded-xl border flex items-center justify-center transition-colors ${
                      isWish
                        ? 'border-pink-500 text-pink-500 bg-pink-950/30'
                        : 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="บันทึกในสิ่งที่อยากได้"
                  >
                    <Heart className={`w-5 h-5 ${isWish ? 'fill-pink-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      setIsCartDrawerOpen(true);
                    }}
                    disabled={stock === 0}
                    className="col-span-2 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <span>ใส่ตะกร้า</span>
                  </button>

                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      onBuyNow(product);
                    }}
                    disabled={stock === 0}
                    className="col-span-2 py-3 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>ซื้อทันที</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Deep Tabs (รายละเอียด, สเปกคอมพิวเตอร์, รีวิวจากผู้ใช้) */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex border-b border-slate-800 mb-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'info' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                รายละเอียดเกม
              </button>
              {product.systemRequirements && (
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`py-2 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'specs' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ความต้องการของระบบ (System Specs)
                </button>
              )}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'reviews' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>รีวิวจากลูกค้า</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                  {reviews.length}
                </span>
              </button>
            </div>

            {/* Tab: Info */}
            {activeTab === 'info' && (
              <div className="text-xs text-slate-300 leading-relaxed space-y-3">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">แพลตฟอร์ม</span>
                    <div className="text-xs font-bold text-white mt-0.5">{product.platform}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">โซนใช้งาน</span>
                    <div className="text-xs font-bold text-white mt-0.5">{product.region}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">แนวเกม</span>
                    <div className="text-xs font-bold text-white mt-0.5">{product.genre.join(', ')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">การจัดส่ง</span>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">Digital Auto-Key</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Specs */}
            {activeTab === 'specs' && product.systemRequirements && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-1.5 text-cyan-400">
                    <Cpu className="w-4 h-4" /> สเปกขั้นต่ำ (Minimum)
                  </h4>
                  <ul className="space-y-2 text-slate-300 text-[11px]">
                    <li><strong className="text-slate-400">OS:</strong> {product.systemRequirements.minimum.os}</li>
                    <li><strong className="text-slate-400">Processor:</strong> {product.systemRequirements.minimum.processor}</li>
                    <li><strong className="text-slate-400">Memory:</strong> {product.systemRequirements.minimum.memory}</li>
                    <li><strong className="text-slate-400">Graphics:</strong> {product.systemRequirements.minimum.graphics}</li>
                    <li><strong className="text-slate-400">Storage:</strong> {product.systemRequirements.minimum.storage}</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-1.5 text-emerald-400">
                    <Cpu className="w-4 h-4" /> สเปกที่แนะนำ (Recommended)
                  </h4>
                  <ul className="space-y-2 text-slate-300 text-[11px]">
                    <li><strong className="text-slate-400">OS:</strong> {product.systemRequirements.recommended.os}</li>
                    <li><strong className="text-slate-400">Processor:</strong> {product.systemRequirements.recommended.processor}</li>
                    <li><strong className="text-slate-400">Memory:</strong> {product.systemRequirements.recommended.memory}</li>
                    <li><strong className="text-slate-400">Graphics:</strong> {product.systemRequirements.recommended.graphics}</li>
                    <li><strong className="text-slate-400">Storage:</strong> {product.systemRequirements.recommended.storage}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Submit Review Form (Purchasers) */}
                {currentUser ? (
                  <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <MessageSquarePlus className="w-4 h-4 text-cyan-400" />
                        เขียนรีวิวสำหรับเกมนี้
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-0.5 focus:outline-none"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      required
                      placeholder="บอกเล่าความรู้สึก ความคุ้มค่า หรือความเร็วในการรับคีย์..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />

                    {reviewSuccess && (
                      <div className="text-[11px] text-emerald-400">ส่งรีวิวเรียบร้อย ขอบคุณสำหรับความคิดเห็นครับ!</div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        ส่งรีวิว
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-400 text-center">
                    กรุณาเข้าสู่ระบบเพื่อเขียนรีวิวสินค้า
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      ยังไม่มีรีวิวสำหรับสินค้านี้ ร่วมเป็นคนแรกที่เขียนรีวิว!
                    </div>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200">{rev.userName}</span>
                            {rev.isVerifiedPurchase && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> ผู้ซื้อที่ยืนยันแล้ว
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
