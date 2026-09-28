import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  GameKey,
  CartItem,
  Order,
  Coupon,
  Review,
  SupportTicket,
  AuditLog,
  NotificationItem,
  StoreSettings,
  DashboardConfig,
  CustomMetricCard,
  WeeklyChartDataPoint,
  PlatformShareDataPoint,
  PaymentMethod,
  Category,
  Platform,
  Genre,
  Region,
  OrderStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_GAME_KEYS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { generateId, generateGameKey } from '../utils/formatters';

interface StoreContextType {
  // Products & Inventory
  products: Product[];
  gameKeys: GameKey[];
  getProductStock: (productId: string) => number;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Game Keys Management
  addKey: (productId: string, keyString: string) => boolean;
  bulkImportKeys: (productId: string, rawKeysText: string) => { added: number; duplicates: number };
  toggleKeyStatus: (keyId: string, status: GameKey['status']) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleCartSelection: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalDiscount: number;
  cartItemCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Orders
  orders: Order[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createOrder: (
    paymentMethod: PaymentMethod,
    customerInfo: { name: string; email: string; phone: string; address?: string }
  ) => Promise<{ success: boolean; orderId?: string; message: string; order?: Order }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  refundOrder: (orderId: string, reason: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, updated: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;

  // Reviews
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  addReview: (productId: string, rating: number, comment: string) => boolean;
  moderateReview: (reviewId: string, status: Review['status']) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  deleteReview: (reviewId: string) => void;

  // Support Tickets
  tickets: SupportTicket[];
  createTicket: (subject: string, category: SupportTicket['category'], message: string, priority: SupportTicket['priority']) => string;
  replyTicket: (ticketId: string, message: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Audit Logs & Notifications
  auditLogs: AuditLog[];
  logAuditAction: (action: string, target: string, before?: string, after?: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetAllData: () => void;

  // Dashboard Customization & Notes
  updateDashboardConfig: (cfg: Partial<DashboardConfig>) => void;
  addAdminNote: (text: string) => void;
  toggleAdminNote: (id: string) => void;
  deleteAdminNote: (id: string) => void;
  quickAddKeysToProduct: (productId: string, count: number) => void;
  addCustomCard: (card: Omit<CustomMetricCard, 'id'>) => void;
  updateCustomCard: (id: string, card: Partial<CustomMetricCard>) => void;
  deleteCustomCard: (id: string) => void;
  updateCardOverride: (cardKey: string, override: { label?: string; customValue?: string; subText?: string }) => void;
  updateWeeklySalesData: (data: WeeklyChartDataPoint[]) => void;
  updatePlatformShareData: (data: PlatformShareDataPoint[]) => void;

  // Storefront Filter States
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (c: Category | 'All') => void;
  selectedPlatform: Platform | 'All';
  setSelectedPlatform: (p: Platform | 'All') => void;
  selectedGenre: Genre | 'All';
  setSelectedGenre: (g: Genre | 'All') => void;
  selectedRegion: Region | 'All';
  setSelectedRegion: (r: Region | 'All') => void;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestseller';
  setSortBy: (s: any) => void;

  // Modal helpers
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (p: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register' | 'forgot' | 'admin';
  setAuthModalTab: (tab: 'login' | 'register' | 'forgot' | 'admin') => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeOrderCompleted: Order | null;
  setActiveOrderCompleted: (order: Order | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  // Load state from localStorage with fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gamestore_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [gameKeys, setGameKeys] = useState<GameKey[]>(() => {
    const saved = localStorage.getItem('gamestore_keys');
    return saved ? JSON.parse(saved) : INITIAL_GAME_KEYS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gamestore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('gamestore_wishlist');
    return saved ? JSON.parse(saved) : ['prod-cp2077', 'prod-mh-wilds'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gamestore_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('gamestore_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gamestore_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('gamestore_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('gamestore_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('gamestore_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('gamestore_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'All'>('All');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestseller'>('featured');

  // Applied Coupon in Cart
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // UI Modals state
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot' | 'admin'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderCompleted, setActiveOrderCompleted] = useState<Order | null>(null);

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('gamestore_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('gamestore_keys', JSON.stringify(gameKeys)); }, [gameKeys]);
  useEffect(() => { localStorage.setItem('gamestore_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('gamestore_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('gamestore_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('gamestore_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('gamestore_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('gamestore_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('gamestore_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('gamestore_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('gamestore_settings', JSON.stringify(settings)); }, [settings]);

  // Inventory helper
  const getProductStock = (productId: string): number => {
    return gameKeys.filter(k => k.productId === productId && k.status === 'available').length;
  };

  // Audit logger
  const logAuditAction = (action: string, target: string, before?: string, after?: string) => {
    const newLog: AuditLog = {
      id: generateId('log'),
      userId: currentUser?.id || 'system',
      userName: currentUser?.name || 'System Auto',
      role: currentUser?.role || 'customer',
      action,
      target,
      before,
      after,
      ip: '192.168.1.100',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...productData,
      id: generateId('prod'),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProd, ...prev]);
    logAuditAction('Create Product', `${newProd.name} (${newProd.sku})`);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    const old = products.find(p => p.id === id);
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...productData } : p)));
    logAuditAction('Update Product', old?.name || id, JSON.stringify(old), JSON.stringify(productData));
  };

  const deleteProduct = (id: string) => {
    const old = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    logAuditAction('Delete Product', old?.name || id);
  };

  // Game Keys Management
  const addKey = (productId: string, keyString: string): boolean => {
    const trimmed = keyString.trim().toUpperCase();
    if (!trimmed) return false;
    const exists = gameKeys.some(k => k.keyString.toUpperCase() === trimmed);
    if (exists) return false;

    const prod = products.find(p => p.id === productId);
    const newKey: GameKey = {
      id: generateId('key'),
      productId,
      productName: prod?.name || 'Unknown Product',
      keyString: trimmed,
      status: 'available',
      createdAt: new Date().toISOString(),
    };
    setGameKeys(prev => [newKey, ...prev]);
    logAuditAction('Add Game Key', `${prod?.name} - Key: ${trimmed.slice(0, 4)}****`);
    return true;
  };

  const bulkImportKeys = (productId: string, rawKeysText: string): { added: number; duplicates: number } => {
    const lines = rawKeysText
      .split('\n')
      .map(l => l.trim().replace(/^["']|["']$/g, '').trim())
      .filter(l => l.length > 0);

    const prod = products.find(p => p.id === productId);
    let addedCount = 0;
    let dupCount = 0;
    const newKeys: GameKey[] = [];
    const batchId = generateId('batch');

    lines.forEach(line => {
      const normalized = line.toUpperCase();
      const isDup = gameKeys.some(k => k.keyString.toUpperCase() === normalized) ||
                    newKeys.some(k => k.keyString.toUpperCase() === normalized);
      if (isDup) {
        dupCount++;
      } else {
        newKeys.push({
          id: generateId('key'),
          productId,
          productName: prod?.name || 'Product',
          keyString: normalized,
          status: 'available',
          createdAt: new Date().toISOString(),
          importedBatch: batchId,
        });
        addedCount++;
      }
    });

    if (newKeys.length > 0) {
      setGameKeys(prev => [...newKeys, ...prev]);
      logAuditAction(
        'Bulk Import Keys',
        `${prod?.name} (Added: ${addedCount}, Duplicates skipped: ${dupCount})`
      );
    }

    return { added: addedCount, duplicates: dupCount };
  };

  const toggleKeyStatus = (keyId: string, status: GameKey['status']) => {
    setGameKeys(prev => prev.map(k => (k.id === keyId ? { ...k, status } : k)));
    logAuditAction('Change Key Status', `Key #${keyId} -> ${status}`);
  };

  // Cart
  const addToCart = (product: Product, quantity: number = 1) => {
    const stock = getProductStock(product.id);
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, Math.max(stock, 1));
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, Math.max(stock, 1)), selected: true }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const stock = getProductStock(productId);
    const safeQty = Math.min(quantity, Math.max(stock, 1));
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const toggleCartSelection = (productId: string) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart calculations
  const selectedCartItems = cart.filter(i => i.selected);
  const cartSubtotal = selectedCartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  let cartTotalDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      const disc = (cartSubtotal * appliedCoupon.discountValue) / 100;
      cartTotalDiscount = appliedCoupon.maxDiscount ? Math.min(disc, appliedCoupon.maxDiscount) : disc;
    } else {
      cartTotalDiscount = Math.min(appliedCoupon.discountValue, cartSubtotal);
    }
  }

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === trimmed && c.isActive);
    if (!found) {
      return { success: false, message: 'คูปองไม่ถูกต้อง หรือหมดอายุแล้ว' };
    }
    if (cartSubtotal < found.minSpend) {
      return { success: false, message: `คูปองนี้ใช้ได้เมื่อมียอดสั่งซื้อขั้นต่ำ ฿${found.minSpend}` };
    }
    if (found.usageLimit && found.usedCount >= found.usageLimit) {
      return { success: false, message: 'คูปองนี้ถูกใช้งานจนครบสิทธิ์แล้ว' };
    }
    setAppliedCoupon(found);
    return { success: true, message: `ใช้คูปอง "${found.code}" สำเร็จ!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Checkout & Order Creation
  const createOrder = async (
    paymentMethod: PaymentMethod,
    customerInfo: { name: string; email: string; phone: string; address?: string }
  ): Promise<{ success: boolean; orderId?: string; message: string; order?: Order }> => {
    if (selectedCartItems.length === 0) {
      return { success: false, message: 'ไม่มีสินค้าที่เลือกในตะกร้า' };
    }

    // Check key availability for all selected items
    const allocatedKeyMap: Record<string, string[]> = {};
    for (const item of selectedCartItems) {
      const availableKeys = gameKeys.filter(
        k => k.productId === item.product.id && k.status === 'available'
      );
      if (availableKeys.length < item.quantity) {
        // If not enough keys, auto-generate fallback demo key or notify
        const keysNeeded = item.quantity - availableKeys.length;
        for (let i = 0; i < keysNeeded; i++) {
          const autoKey = generateGameKey(item.product.platform.substring(0, 4).toUpperCase());
          availableKeys.push({
            id: generateId('key'),
            productId: item.product.id,
            productName: item.product.name,
            keyString: autoKey,
            status: 'available',
            createdAt: new Date().toISOString(),
          });
        }
      }
      allocatedKeyMap[item.product.id] = availableKeys.slice(0, item.quantity).map(k => k.keyString);
    }

    const orderId = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const finalTotal = Math.max(0, cartSubtotal - cartTotalDiscount);

    // Update keys to sold in state
    const nowIso = new Date().toISOString();
    const updatedKeys = [...gameKeys];
    selectedCartItems.forEach(item => {
      const keysForThis = allocatedKeyMap[item.product.id] || [];
      keysForThis.forEach(keyStr => {
        const foundIdx = updatedKeys.findIndex(k => k.keyString === keyStr);
        if (foundIdx >= 0) {
          updatedKeys[foundIdx] = {
            ...updatedKeys[foundIdx],
            status: 'sold',
            orderId,
            soldToUserId: currentUser?.id || 'guest',
            soldAt: nowIso,
          };
        } else {
          // If was generated dynamically
          updatedKeys.push({
            id: generateId('key'),
            productId: item.product.id,
            productName: item.product.name,
            keyString: keyStr,
            status: 'sold',
            orderId,
            soldToUserId: currentUser?.id || 'guest',
            soldAt: nowIso,
            createdAt: nowIso,
          });
        }
      });
    });
    setGameKeys(updatedKeys);

    // Order object
    const newOrder: Order = {
      id: orderId,
      userId: currentUser?.id || 'guest',
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      items: selectedCartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        coverImage: item.product.coverImage,
        platform: item.product.platform,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        quantity: item.quantity,
        deliveredKeys: allocatedKeyMap[item.product.id] || [],
      })),
      subtotal: cartSubtotal,
      discountAmount: cartTotalDiscount,
      couponCode: appliedCoupon?.code,
      fee: 0,
      total: finalTotal,
      status: 'Delivered',
      paymentMethod,
      paymentStatus: 'Paid',
      transactionRef: `TXN-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      digitalDeliveryStatus: 'Delivered',
      paidAt: nowIso,
      deliveredAt: nowIso,
      createdAt: nowIso,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update coupon usage count
    if (appliedCoupon) {
      setCoupons(prev =>
        prev.map(c => (c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c))
      );
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: generateId('notif'),
      targetRole: 'admin',
      title: `คำสั่งซื้อใหม่ #${orderId}`,
      message: `${customerInfo.name} ชำระเงิน ฿${finalTotal.toLocaleString()} สำเร็จ และได้รับคีย์แล้ว`,
      type: 'order',
      isRead: false,
      timestamp: nowIso,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Audit log
    logAuditAction('Order Created & Delivered', `#${orderId} - Total: ฿${finalTotal}`);

    // Remove bought items from cart
    setCart(prev => prev.filter(item => !item.selected));
    setAppliedCoupon(null);
    setActiveOrderCompleted(newOrder);

    return { success: true, orderId, message: 'สั่งซื้อและจัดส่งคีย์สำเร็จ!', order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status, notes: notes || o.notes } : o))
    );
    logAuditAction('Update Order Status', `#${orderId} -> ${status}`);
  };

  const refundOrder = (orderId: string, reason: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: 'Refunded', paymentStatus: 'Refunded', notes: reason } : o
      )
    );
    logAuditAction('Refund Order', `#${orderId} - Reason: ${reason}`);
  };

  // Coupons
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: generateId('coup'),
      usedCount: 0,
    };
    setCoupons(prev => [newCoupon, ...prev]);
    logAuditAction('Create Coupon', `Code: ${newCoupon.code}`);
  };

  const toggleCouponActive = (id: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const updateCoupon = (id: string, updated: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
    logAuditAction('Update Coupon', `ID: #${id}`);
  };

  const deleteCoupon = (id: string) => {
    const target = coupons.find(c => c.id === id);
    setCoupons(prev => prev.filter(c => c.id !== id));
    logAuditAction('Delete Coupon', `Code: ${target?.code || id}`);
  };

  // Reviews
  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId && r.status === 'published');
  };

  const addReview = (productId: string, rating: number, comment: string): boolean => {
    if (!currentUser) return false;
    const prod = products.find(p => p.id === productId);
    const hasBought = orders.some(
      o => o.userId === currentUser.id && o.items.some(i => i.productId === productId)
    );

    const newRev: Review = {
      id: generateId('rev'),
      productId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      isVerifiedPurchase: hasBought,
      createdAt: new Date().toISOString(),
      status: 'published',
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate product rating
    const allProdRevs = [...reviews.filter(r => r.productId === productId), newRev];
    const avgRating = (allProdRevs.reduce((acc, r) => acc + r.rating, 0) / allProdRevs.length);
    updateProduct(productId, {
      rating: Number(avgRating.toFixed(2)),
      reviewCount: (prod?.reviewCount || 0) + 1,
    });

    logAuditAction('Add Review', `Product: ${prod?.name} - Stars: ${rating}`);
    return true;
  };

  const moderateReview = (reviewId: string, status: Review['status']) => {
    setReviews(prev => prev.map(r => (r.id === reviewId ? { ...r, status } : r)));
    logAuditAction('Moderate Review', `#${reviewId} -> ${status}`);
  };

  const replyToReview = (reviewId: string, reply: string) => {
    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? { ...r, adminReply: reply, adminReplyAt: new Date().toISOString() }
          : r
      )
    );
    logAuditAction('Reply to Review', `Review ID: #${reviewId}`);
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    logAuditAction('Delete Review', `Review ID: #${reviewId}`);
  };

  // Tickets
  const createTicket = (
    subject: string,
    category: SupportTicket['category'],
    message: string,
    priority: SupportTicket['priority']
  ): string => {
    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: ticketId,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest User',
      userEmail: currentUser?.email || 'guest@gamestore.local',
      subject,
      category,
      status: 'Open',
      priority,
      createdAt: nowIso,
      updatedAt: nowIso,
      messages: [
        {
          id: generateId('msg'),
          sender: 'user',
          senderName: currentUser?.name || 'Guest',
          message,
          timestamp: nowIso,
        },
      ],
    };
    setTickets(prev => [newTicket, ...prev]);

    // Notify admin
    const newNotif: NotificationItem = {
      id: generateId('notif'),
      targetRole: 'admin',
      title: `Ticket ใหม่ #${ticketId}`,
      message: `${newTicket.userName} ส่งคำร้อง: ${subject}`,
      type: 'ticket',
      isRead: false,
      timestamp: nowIso,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return ticketId;
  };

  const replyTicket = (ticketId: string, message: string) => {
    const isStaffUser = currentUser?.role === 'admin' || currentUser?.role === 'super_admin' || currentUser?.role === 'staff';
    const nowIso = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: isStaffUser ? 'Answered' : 'Pending',
            updatedAt: nowIso,
            messages: [
              ...t.messages,
              {
                id: generateId('msg'),
                sender: isStaffUser ? 'staff' : 'user',
                senderName: currentUser?.name || 'Staff Support',
                message,
                timestamp: nowIso,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAuditAction('Update Store Settings', 'General Configuration');
  };

  const updateDashboardConfig = (cfg: Partial<DashboardConfig>) => {
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          ...cfg,
          visibleWidgets: {
            ...currentDash.visibleWidgets,
            ...(cfg.visibleWidgets || {}),
          },
        },
      };
    });
    logAuditAction('Update Dashboard Configuration', 'Dashboard Widgets & KPI Targets');
  };

  const addAdminNote = (text: string) => {
    if (!text.trim()) return;
    const newNote = {
      id: generateId('note'),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          adminNotes: [newNote, ...(currentDash.adminNotes || [])],
        },
      };
    });
  };

  const toggleAdminNote = (id: string) => {
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          adminNotes: (currentDash.adminNotes || []).map(n =>
            n.id === id ? { ...n, completed: !n.completed } : n
          ),
        },
      };
    });
  };

  const deleteAdminNote = (id: string) => {
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          adminNotes: (currentDash.adminNotes || []).filter(n => n.id !== id),
        },
      };
    });
  };

  const quickAddKeysToProduct = (productId: string, count: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newKeys: GameKey[] = [];
    const nowIso = new Date().toISOString();
    for (let i = 0; i < count; i++) {
      newKeys.push({
        id: generateId('key'),
        productId,
        productName: prod.name,
        keyString: generateGameKey(prod.platform.slice(0, 4).toUpperCase()),
        status: 'available',
        createdAt: nowIso,
        importedBatch: 'quick-restock',
      });
    }
    setGameKeys(prev => [...newKeys, ...prev]);
    logAuditAction('Quick Restock Keys', `${prod.name} (+${count} คีย์)`);
  };

  const addCustomCard = (card: Omit<CustomMetricCard, 'id'>) => {
    const newCard: CustomMetricCard = {
      ...card,
      id: generateId('card'),
    };
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          customCards: [...(currentDash.customCards || []), newCard],
        },
      };
    });
    logAuditAction('Add Custom Dashboard Card', `Card: ${newCard.title}`);
  };

  const updateCustomCard = (id: string, card: Partial<CustomMetricCard>) => {
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          customCards: (currentDash.customCards || []).map(c =>
            c.id === id ? { ...c, ...card } : c
          ),
        },
      };
    });
    logAuditAction('Update Custom Dashboard Card', `Card ID: ${id}`);
  };

  const deleteCustomCard = (id: string) => {
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          customCards: (currentDash.customCards || []).filter(c => c.id !== id),
        },
      };
    });
    logAuditAction('Delete Custom Dashboard Card', `Card ID: ${id}`);
  };

  const updateCardOverride = (
    cardKey: string,
    override: { label?: string; customValue?: string; subText?: string }
  ) => {
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      const existing = currentDash.cardOverrides || {};
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          cardOverrides: {
            ...existing,
            [cardKey]: {
              ...(existing[cardKey] || {}),
              ...override,
            },
          },
        },
      };
    });
    logAuditAction('Override Dashboard Metric', `Key: ${cardKey}`);
  };

  const updateWeeklySalesData = (data: WeeklyChartDataPoint[]) => {
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          weeklySalesData: data,
        },
      };
    });
    logAuditAction('Update Weekly Sales Chart', 'Custom Chart Points');
  };

  const updatePlatformShareData = (data: PlatformShareDataPoint[]) => {
    setSettings(prev => {
      const currentDash = prev.dashboardConfig || INITIAL_SETTINGS.dashboardConfig!;
      return {
        ...prev,
        dashboardConfig: {
          ...currentDash,
          platformShareData: data,
        },
      };
    });
    logAuditAction('Update Platform Share Chart', 'Custom Platform Shares');
  };

  const resetAllData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setGameKeys(INITIAL_GAME_KEYS);
    setCoupons(INITIAL_COUPONS);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setTickets(INITIAL_TICKETS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    setWishlist(['prod-cp2077', 'prod-mh-wilds']);
    setAppliedCoupon(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        gameKeys,
        getProductStock,
        addProduct,
        updateProduct,
        deleteProduct,
        addKey,
        bulkImportKeys,
        toggleKeyStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleCartSelection,
        clearCart,
        cartSubtotal,
        cartTotalDiscount,
        cartItemCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateOrderStatus,
        refundOrder,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponActive,
        reviews,
        getProductReviews,
        addReview,
        moderateReview,
        replyToReview,
        deleteReview,
        tickets,
        createTicket,
        replyTicket,
        updateTicketStatus,
        auditLogs,
        logAuditAction,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        settings,
        updateSettings,
        resetAllData,
        updateDashboardConfig,
        addAdminNote,
        toggleAdminNote,
        deleteAdminNote,
        quickAddKeysToProduct,
        addCustomCard,
        updateCustomCard,
        deleteCustomCard,
        updateCardOverride,
        updateWeeklySalesData,
        updatePlatformShareData,
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
        selectedProductForModal,
        setSelectedProductForModal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrderCompleted,
        setActiveOrderCompleted,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
