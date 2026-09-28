export type UserRole = 'customer' | 'staff' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  walletBalance: number;
  points: number;
  isBanned?: boolean;
  emailVerified?: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type Platform = 'Steam' | 'Epic Games' | 'PlayStation' | 'Xbox' | 'Nintendo' | 'PC' | 'Gift Card' | 'Top-up';

export type Category = 'Game Key' | 'Gift Card' | 'DLC' | 'Bundle' | 'Game Top-up';

export type Genre = 'Action' | 'RPG' | 'Open World' | 'Shooter' | 'Strategy' | 'Sports' | 'Adventure' | 'Survival';

export type Region = 'Global' | 'TH/Asia' | 'US' | 'EU';

export interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  screenshots: string[];
  category: Category;
  platform: Platform;
  region: Region;
  genre: Genre[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  cost: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  rating: number;
  reviewCount: number;
  systemRequirements?: {
    minimum: SystemRequirements;
    recommended: SystemRequirements;
  };
  tags: string[];
  createdAt: string;
}

export type KeyStatus = 'available' | 'reserved' | 'sold' | 'revoked';

export interface GameKey {
  id: string;
  productId: string;
  productName: string;
  keyString: string;
  status: KeyStatus;
  orderId?: string;
  soldToUserId?: string;
  soldAt?: string;
  createdAt: string;
  importedBatch?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Awaiting Payment'
  | 'Paid'
  | 'Processing'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled'
  | 'Refunded';

export type PaymentMethod = 'PromptPay' | 'CreditCard' | 'BankTransfer' | 'Wallet';

export type PaymentStatus = 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Refunded' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  coverImage: string;
  platform: Platform;
  price: number;
  originalPrice: number;
  quantity: number;
  deliveredKeys?: string[];
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  fee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionRef: string;
  digitalDeliveryStatus: 'Delivered' | 'Pending' | 'None';
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategory?: Category | 'All';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  status: 'published' | 'hidden' | 'reported';
  adminReply?: string;
  adminReplyAt?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Game Key Issue' | 'Payment & Refund' | 'Account' | 'Technical' | 'General';
  status: 'Open' | 'Pending' | 'Answered' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'user' | 'staff' | 'system';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  target: string;
  before?: string;
  after?: string;
  ip: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  targetUserId?: string; // empty means all or admin
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'ticket' | 'promo';
  isRead: boolean;
  link?: string;
  timestamp: string;
}

export interface CustomMetricCard {
  id: string;
  title: string;
  value: string;
  changeText?: string;
  isPositive?: boolean;
  color: 'cyan' | 'amber' | 'emerald' | 'purple' | 'rose' | 'blue';
  subtitle?: string;
}

export interface WeeklyChartDataPoint {
  day: string;
  val: number;
  pct: number;
}

export interface PlatformShareDataPoint {
  platform: string;
  percent: number;
  color: string;
}

export interface DashboardConfig {
  dailyTarget: number;
  monthlyTarget: number;
  dashboardNotice: string;
  showNotice: boolean;
  accentTheme: 'amber' | 'cyan' | 'emerald' | 'purple';
  visibleWidgets: {
    todaySales: boolean;
    totalRevenue: boolean;
    ordersCount: boolean;
    keysAvailable: boolean;
    totalProducts: boolean;
    totalCustomers: boolean;
    lowStockAlert: boolean;
    autoDeliveryRate: boolean;
    salesChart: boolean;
    platformShare: boolean;
    recentOrdersTable: boolean;
    lowStockTable: boolean;
  };
  cardOverrides?: Record<string, { label?: string; customValue?: string; subText?: string }>;
  customCards?: CustomMetricCard[];
  weeklySalesData?: WeeklyChartDataPoint[];
  platformShareData?: PlatformShareDataPoint[];
  adminNotes: {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
  }[];
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  enablePromptPay: boolean;
  enableCreditCard: boolean;
  enableBankTransfer: boolean;
  enableWallet: boolean;
  lowStockThreshold: number;
  pointsRate: number; // e.g. 1 point per 100 THB
  autoDeliverKeys: boolean;
  dashboardConfig?: DashboardConfig;
}
