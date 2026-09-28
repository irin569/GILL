import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Key,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Tag,
  Eye
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Platform, Category, Region, Genre } from '../../types';
import { formatTHB } from '../../utils/formatters';

interface AdminProductsProps {
  onNavigateToKeys: (productId?: string) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ onNavigateToKeys }) => {
  const { products, addProduct, updateProduct, deleteProduct, getProductStock } = useStore();

  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [platform, setPlatform] = useState<Platform>('Steam');
  const [category, setCategory] = useState<Category>('Game Key');
  const [region, setRegion] = useState<Region>('Global');
  const [price, setPrice] = useState<number>(990);
  const [originalPrice, setOriginalPrice] = useState<number>(1290);
  const [cost, setCost] = useState<number>(800);
  const [tags, setTags] = useState('');
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platformFilter === 'All' || p.platform === platformFilter;
    return matchSearch && matchPlatform;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setSku(`GS-${Date.now().toString().slice(-4)}`);
    setName('');
    setTagline('');
    setDescription('');
    setCoverImage('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
    setPlatform('Steam');
    setCategory('Game Key');
    setRegion('Global');
    setPrice(990);
    setOriginalPrice(1290);
    setCost(800);
    setTags('Action, Adventure');
    setIsFlashSale(false);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setSku(prod.sku);
    setName(prod.name);
    setTagline(prod.tagline || '');
    setDescription(prod.description);
    setCoverImage(prod.coverImage);
    setPlatform(prod.platform);
    setCategory(prod.category);
    setRegion(prod.region);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice);
    setCost(prod.cost || Math.round(prod.price * 0.8));
    setTags(prod.tags.join(', '));
    setIsFlashSale(!!prod.isFlashSale);
    setIsFeatured(!!prod.isFeatured);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        sku,
        name,
        tagline,
        description,
        coverImage,
        platform,
        category,
        region,
        price: Number(price),
        originalPrice: Number(originalPrice),
        discountPercent,
        cost: Number(cost),
        tags: tagList,
        isFlashSale,
        isFeatured,
      });
    } else {
      addProduct({
        sku,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline,
        description,
        coverImage,
        screenshots: [coverImage],
        platform,
        category,
        region,
        genre: ['Action', 'RPG'],
        price: Number(price),
        originalPrice: Number(originalPrice),
        discountPercent,
        cost: Number(cost),
        isFeatured,
        isFlashSale,
        rating: 5.0,
        reviewCount: 0,
        tags: tagList,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="ค้นหาชื่อเกม หรือ SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="All">ทุกแพลตฟอร์ม</option>
            <option value="Steam">Steam</option>
            <option value="Epic Games">Epic Games</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
            <option value="Nintendo">Nintendo</option>
            <option value="PC">PC</option>
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มสินค้าใหม่ (Add Product)</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">สินค้า (Product)</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">แพลตฟอร์ม</th>
                <th className="py-3 px-4">ราคาขาย</th>
                <th className="py-3 px-4">ต้นทุน</th>
                <th className="py-3 px-4">คงเหลือ (Stock)</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredProducts.map(p => {
                const stock = getProductStock(p.id);
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.coverImage} alt="" className="w-12 h-8 rounded-lg object-cover bg-slate-950" />
                        <div>
                          <div className="font-bold text-white max-w-xs truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-500">{p.category} • {p.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{p.sku}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-semibold text-cyan-300 border border-slate-700">
                        {p.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-display font-bold text-white">{formatTHB(p.price)}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{formatTHB(p.cost || p.price * 0.8)}</td>
                    <td className="py-3 px-4">
                      {stock > 3 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> {stock} คีย์
                        </span>
                      ) : stock > 0 ? (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> เหลือ {stock} คีย์
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold">หมด (0)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigateToKeys(p.id)}
                          className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 transition-colors"
                          title="จัดการ Game Keys ของสินค้านี้"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="แก้ไขสินค้า"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`คุณต้องการลบ "${p.name}" หรือไม่?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors"
                          title="ลบสินค้า"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0f121e] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <h3 className="font-display font-bold text-base text-white">
                {editingProduct ? `แก้ไขสินค้า: ${editingProduct.name}` : 'เพิ่มสินค้าใหม่ลงร้าน'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">รหัส SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ชื่อสินค้า (Product Name)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">คำโปรยสั้น (Tagline)</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">รายละเอียดสินค้า (Description)</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">แพลตฟอร์ม</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Steam">Steam</option>
                    <option value="Epic Games">Epic Games</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo">Nintendo</option>
                    <option value="PC">PC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">หมวดหมู่</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Game Key">Game Key</option>
                    <option value="Gift Card">Gift Card</option>
                    <option value="DLC">DLC / Expansion</option>
                    <option value="Bundle">Bundle</option>
                    <option value="Game Top-up">Game Top-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">โซน (Region)</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Global">Global</option>
                    <option value="TH/Asia">TH / Asia</option>
                    <option value="US">US</option>
                    <option value="EU">EU</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ราคาขาย (Price THB)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ราคาเดิมก่อนลด (Original)</label>
                  <input
                    type="number"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ต้นทุน (Cost THB)</label>
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL รูปภาพหน้าปก (Cover Image)</label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500"
                  />
                  <span>สินค้าแนะนำ (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFlashSale}
                    onChange={(e) => setIsFlashSale(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-rose-500"
                  />
                  <span>นำเข้า Flash Sale</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกสินค้า</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
