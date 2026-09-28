import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatTHB } from '../../utils/formatters';

interface HeroBannerProps {
  onSelectProduct: (product: Product) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectProduct }) => {
  const { products, addToCart, setIsCartDrawerOpen } = useStore();
  
  // Featured games for hero
  const featured = products.filter(p => p.isFeatured || p.isBestSeller).slice(0, 4);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const current = featured[currentIdx];

  const handleNext = () => {
    setCurrentIdx((currentIdx + 1) % featured.length);
  };

  const handlePrev = () => {
    setCurrentIdx((currentIdx - 1 + featured.length) % featured.length);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 bg-gradient-to-br from-slate-900 via-[#0e1222] to-[#0a0c16] shadow-2xl my-6">
      
      {/* Background Cover Image with cinematic gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.coverImage}
          alt={current.name}
          className="w-full h-full object-cover object-center opacity-30 filter blur-xs scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d18] via-[#0b0d18]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d18] via-[#0b0d18]/70 to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-4xl">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 flex items-center gap-1 shadow-lg shadow-cyan-500/20">
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            HOT RELEASE
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-cyan-300 border border-cyan-500/30">
            {current.platform}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-slate-300 border border-slate-700">
            Region: {current.region}
          </span>
          {current.discountPercent > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
              ลด {current.discountPercent}%
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-wide leading-tight mb-3 drop-shadow-md">
          {current.name}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl line-clamp-2 mb-6 leading-relaxed">
          {current.tagline || current.description}
        </p>

        {/* Price & Actions */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display font-black text-2xl sm:text-3xl text-cyan-400">
              {formatTHB(current.price)}
            </span>
            {current.originalPrice > current.price && (
              <span className="text-slate-500 line-through text-sm sm:text-base">
                {formatTHB(current.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                addToCart(current, 1);
                setIsCartDrawerOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>ซื้อทันที (Buy Now)</span>
            </button>
            <button
              onClick={() => onSelectProduct(current)}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>ดูข้อมูลเกม</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 px-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIdx ? 'w-6 bg-cyan-400' : 'w-1.5 bg-slate-600'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
