import React from 'react';
import { Filter, SlidersHorizontal, Search, RotateCcw, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../../context/StoreContext';
import { Category, Platform, Genre, Region, Product } from '../../types';

interface ProductGridProps {
  onSelectProduct: (product: Product) => void;
}

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Game Key',
  'Gift Card',
  'DLC',
  'Bundle',
  'Game Top-up',
];

const PLATFORMS: (Platform | 'All')[] = [
  'All',
  'Steam',
  'Epic Games',
  'PlayStation',
  'Xbox',
  'Nintendo',
  'PC',
];

const GENRES: (Genre | 'All')[] = [
  'All',
  'Action',
  'RPG',
  'Open World',
  'Shooter',
  'Strategy',
  'Sports',
  'Adventure',
];

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct }) => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    selectedGenre,
    setSelectedGenre,
    selectedRegion,
    setSelectedRegion,
    sortBy,
    setSortBy,
  } = useStore();

  // Filter & Search Logic
  const filteredProducts = products.filter(p => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
      const matchPlatform = p.platform.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchTag && !matchPlatform) return false;
    }

    // Category
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }

    // Platform
    if (selectedPlatform !== 'All' && p.platform !== selectedPlatform) {
      return false;
    }

    // Genre
    if (selectedGenre !== 'All' && !p.genre.includes(selectedGenre as Genre)) {
      return false;
    }

    // Region
    if (selectedRegion !== 'All' && p.region !== selectedRegion) {
      return false;
    }

    return true;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'bestseller':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      default:
        // featured
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
    }
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPlatform('All');
    setSelectedGenre('All');
    setSelectedRegion('All');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    selectedPlatform !== 'All' ||
    selectedGenre !== 'All' ||
    selectedRegion !== 'All';

  return (
    <section className="my-10" id="all-products">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide flex items-center gap-2">
            คลังสินค้าทั้งหมด <span className="text-cyan-400">GAME STORE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            พบสินค้าทั้งหมด <strong className="text-cyan-400">{sortedProducts.length}</strong> รายการ | รหัสแท้ ส่งทันที 24 ชม.
          </p>
        </div>

        {/* Sort and Region selector */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>เรียงตาม:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="เรียงลำดับสินค้า"
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-slate-900">แนะนำ (Featured)</option>
              <option value="price_asc" className="bg-slate-900">ราคา: ต่ำ &rarr; สูง</option>
              <option value="price_desc" className="bg-slate-900">ราคา: สูง &rarr; ต่ำ</option>
              <option value="rating" className="bg-slate-900">คะแนนรีวิวสูงสุด</option>
              <option value="bestseller" className="bg-slate-900">สินค้าขายดี</option>
              <option value="newest" className="bg-slate-900">มาใหม่ล่าสุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat === 'All' ? '⚡ ทุกหมวดหมู่' : cat}
          </button>
        ))}
      </div>

      {/* Sub Filter Toolbar (Platforms, Genre, Region, Reset) */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 mb-8 flex flex-wrap items-center justify-between gap-4">
        
        {/* Platforms */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1">แพลตฟอร์ม:</span>
          {PLATFORMS.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                selectedPlatform === p
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'All' ? 'ทั้งหมด' : p}
            </button>
          ))}
        </div>

        {/* Genre & Region Selectors */}
        <div className="flex items-center gap-3">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value as any)}
            aria-label="กรองแนวเกม"
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="All">ทุกแนวเกม (Genre)</option>
            {GENRES.filter(g => g !== 'All').map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as any)}
            aria-label="กรองโซน Region"
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="All">ทุกโซน (Region)</option>
            <option value="Global">Global (ทั่วโลก)</option>
            <option value="TH/Asia">TH / Asia</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/60 text-xs transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              ล้างตัวกรอง
            </button>
          )}
        </div>

      </div>

      {/* Product Cards Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500 mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">ไม่พบสินค้าที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-400 mb-6">
            ลองปรับเปลี่ยนคำค้นหา หรือล้างตัวกรองเพื่อดูรายการสินค้าทั้งหมด
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

    </section>
  );
};
