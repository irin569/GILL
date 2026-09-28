import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatTHB } from '../../utils/formatters';

interface FlashSaleSectionProps {
  onSelectProduct: (product: Product) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({ onSelectProduct }) => {
  const { products, addToCart, setIsCartDrawerOpen, getProductStock } = useStore();

  const flashSaleItems = products.filter(p => p.isFlashSale);

  // Countdown timer simulation (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashSaleItems.length === 0) return null;

  return (
    <section className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-indigo-950/40 border border-rose-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Countdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-rose-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/40 animate-bounce">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-white tracking-wide flex items-center gap-2">
              FLASH SALE <span className="text-rose-400 text-sm font-sans font-normal">ลดกระหน่ำจำกัดเวลา</span>
            </h2>
            <p className="text-xs text-rose-300/80">ดีลพิเศษลดสูงสุด 50% คีย์พร้อมส่งทันที</p>
          </div>
        </div>

        {/* Countdown Ticker */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-2xl border border-rose-500/40 shadow-inner">
          <Clock className="w-4 h-4 text-rose-400" />
          <span className="text-xs text-slate-300 font-medium">สิ้นสุดใน:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm text-white">
            <span className="px-2 py-0.5 rounded bg-rose-900/80 border border-rose-700/60">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-rose-400">:</span>
            <span className="px-2 py-0.5 rounded bg-rose-900/80 border border-rose-700/60">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-rose-400">:</span>
            <span className="px-2 py-0.5 rounded bg-rose-900/80 border border-rose-700/60 text-amber-300">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Flash Sale Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashSaleItems.map(item => {
          const stock = getProductStock(item.id);
          return (
            <div
              key={item.id}
              className="group bg-slate-900/80 hover:bg-slate-800/90 border border-rose-500/20 hover:border-rose-500/60 rounded-2xl p-4 transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div
                  onClick={() => onSelectProduct(item)}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer mb-3.5 bg-slate-950"
                >
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-md">
                    <Zap className="w-3 h-3 fill-white" />
                    -{item.discountPercent}%
                  </div>
                  <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-xs text-cyan-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-700">
                    {item.platform}
                  </div>
                </div>

                {/* Info */}
                <h3
                  onClick={() => onSelectProduct(item)}
                  className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors cursor-pointer line-clamp-1 mb-1"
                >
                  {item.name}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-1 mb-3">
                  {item.tagline || item.description}
                </p>

                {/* Stock Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {stock > 0 ? `เหลือเพียง ${stock} คีย์!` : 'สินค้าหมดชั่วคราว'}
                    </span>
                    <span className="text-slate-500 text-[10px]">คีย์แท้จัดส่งทันที</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(15, stock * 25))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Price & Cart */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <div className="text-slate-500 line-through text-[11px]">
                    {formatTHB(item.originalPrice)}
                  </div>
                  <div className="text-base font-display font-black text-rose-400">
                    {formatTHB(item.price)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(item, 1);
                    setIsCartDrawerOpen(true);
                  }}
                  disabled={stock === 0}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>ใส่ตะกร้า</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
