import React from 'react';
import { ShoppingCart, Heart, Star, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatTHB } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, setIsCartDrawerOpen, wishlist, toggleWishlist, getProductStock } = useStore();
  const stock = getProductStock(product.id);
  const isWish = wishlist.includes(product.id);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Steam':
        return 'text-sky-400 bg-sky-950/60 border-sky-500/30';
      case 'Epic Games':
        return 'text-purple-400 bg-purple-950/60 border-purple-500/30';
      case 'PlayStation':
        return 'text-blue-400 bg-blue-950/60 border-blue-500/30';
      case 'Xbox':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
      case 'Nintendo':
        return 'text-red-400 bg-red-950/60 border-red-500/30';
      default:
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';
    }
  };

  return (
    <div className="group relative bg-[#121524]/90 hover:bg-[#161a2e] border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between">
      
      {/* Top Cover Section */}
      <div>
        <div
          onClick={() => onSelect(product)}
          className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-slate-950"
        >
          <img
            src={product.coverImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Discount Pill */}
          {product.discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow-lg">
              -{product.discountPercent}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-pink-500 transition-colors backdrop-blur-xs"
            title={isWish ? 'ลบออกจากสิ่งที่อยากได้' : 'เพิ่มในสิ่งที่อยากได้'}
          >
            <Heart className={`w-4 h-4 ${isWish ? 'fill-pink-500 text-pink-500' : ''}`} />
          </button>

          {/* Region Badge */}
          <div className="absolute bottom-2 left-2.5 bg-slate-950/80 backdrop-blur-xs text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-800">
            {product.region}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          {/* Platform and Category */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getPlatformColor(product.platform)}`}>
              {product.platform}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {product.category}
            </span>
          </div>

          {/* Game Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 cursor-pointer mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating and Genre */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white font-semibold text-xs">{product.rating}</span>
              <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
            </div>
            <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
              {product.genre.slice(0, 2).join(', ')}
            </span>
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-1.5 text-[11px] mb-3">
            {stock > 3 ? (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3" />
                มีสินค้าพร้อมส่ง ({stock} คีย์)
              </span>
            ) : stock > 0 ? (
              <span className="text-amber-400 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3" />
                คีย์เหลือน้อย ({stock} คีย์)
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                สินค้าหมดชั่วคราว
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Price & Add to Cart */}
      <div className="p-4 pt-0 border-t border-slate-800/80 mt-auto">
        <div className="flex items-center justify-between pt-3">
          <div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-500 line-through">
                {formatTHB(product.originalPrice)}
              </div>
            )}
            <div className="font-display font-black text-lg text-cyan-400 leading-none">
              {formatTHB(product.price)}
            </div>
          </div>

          <button
            onClick={() => {
              addToCart(product, 1);
              setIsCartDrawerOpen(true);
            }}
            disabled={stock === 0}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            title="เพิ่มลงตะกร้า"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
