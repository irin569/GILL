import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  Package,
  Key,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles,
  ChevronRight,
  Settings2,
  CheckCircle2,
  X,
  Edit3,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Sliders,
  Target,
  Megaphone,
  Save,
  RotateCcw,
  BarChart3,
  PieChart,
  Palette,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatTHB, formatDate } from '../../utils/formatters';
import {
  OrderStatus,
  DashboardConfig,
  CustomMetricCard,
  WeeklyChartDataPoint,
  PlatformShareDataPoint
} from '../../types';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const {
    orders,
    products,
    gameKeys,
    settings,
    updateDashboardConfig,
    addAdminNote,
    toggleAdminNote,
    deleteAdminNote,
    quickAddKeysToProduct,
    updateOrderStatus,
    addCustomCard,
    updateCustomCard,
    deleteCustomCard,
    updateCardOverride,
    updateWeeklySalesData,
    updatePlatformShareData
  } = useStore();
  const { users } = useAuth();

  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'month' | 'all'>('month');

  // Live Inline Edit Mode Toggle
  const [isLiveEditMode, setIsLiveEditMode] = useState(false);

  // Full Dashboard Config Modal state
  const [isEditDashboardOpen, setIsEditDashboardOpen] = useState(false);

  // Card Override Edit Modal state
  const [editingCardKey, setEditingCardKey] = useState<{ key: string; defaultLabel: string; defaultVal: string } | null>(null);
  const [overrideLabel, setOverrideLabel] = useState('');
  const [overrideValue, setOverrideValue] = useState('');
  const [overrideSubText, setOverrideSubText] = useState('');

  // Custom Card Creator Modal state
  const [isNewCustomCardOpen, setIsNewCustomCardOpen] = useState(false);
  const [customCardTitle, setCustomCardTitle] = useState('');
  const [customCardValue, setCustomCardValue] = useState('');
  const [customCardChange, setCustomCardChange] = useState('+15.5%');
  const [customCardColor, setCustomCardColor] = useState<'cyan' | 'amber' | 'emerald' | 'purple' | 'rose'>('cyan');
  const [customCardSub, setCustomCardSub] = useState('');

  // Weekly Chart Editor Modal state
  const [isChartEditorOpen, setIsChartEditorOpen] = useState(false);
  const [chartDataInputs, setChartDataInputs] = useState<WeeklyChartDataPoint[]>([]);

  // Platform Share Editor Modal state
  const [isPlatformEditorOpen, setIsPlatformEditorOpen] = useState(false);
  const [platformDataInputs, setPlatformDataInputs] = useState<PlatformShareDataPoint[]>([]);

  // Quick Restock Modal state
  const [restockProduct, setRestockProduct] = useState<{ id: string; name: string } | null>(null);
  const [restockCount, setRestockCount] = useState<number>(5);
  const [restockSuccess, setRestockSuccess] = useState<string | null>(null);

  // Quick Edit Order state
  const [quickOrderEdit, setQuickOrderEdit] = useState<{ id: string; status: OrderStatus } | null>(null);

  // Admin New Note Input
  const [newNoteText, setNewNoteText] = useState('');
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Fallback / Active Dashboard Config
  const dashConfig: DashboardConfig = settings.dashboardConfig || {
    dailyTarget: 25000,
    monthlyTarget: 500000,
    dashboardNotice: '📢 สัปดาห์นี้แคมเปญ Flash Sale ขายดีเป็นพิเศษ! ทีมงานอย่าลืมเติมคีย์ Steam ให้เพียงพอกับยอดสั่งซื้อ',
    showNotice: true,
    accentTheme: 'amber',
    visibleWidgets: {
      todaySales: true,
      totalRevenue: true,
      ordersCount: true,
      keysAvailable: true,
      totalProducts: true,
      totalCustomers: true,
      lowStockAlert: true,
      autoDeliveryRate: true,
      salesChart: true,
      platformShare: true,
      recentOrdersTable: true,
      lowStockTable: true,
    },
    cardOverrides: {},
    customCards: [],
    weeklySalesData: [
      { day: 'จ.', val: 4200, pct: 45 },
      { day: 'อ.', val: 6800, pct: 65 },
      { day: 'พ.', val: 5100, pct: 52 },
      { day: 'พฤ.', val: 7900, pct: 78 },
      { day: 'ศ.', val: 12400, pct: 95 },
      { day: 'ส.', val: 11200, pct: 88 },
      { day: 'อา.', val: 10800, pct: 82 },
    ],
    platformShareData: [
      { platform: 'Steam Keys', percent: 52, color: 'bg-sky-500' },
      { platform: 'Epic Games', percent: 22, color: 'bg-purple-500' },
      { platform: 'PlayStation / PSN', percent: 14, color: 'bg-blue-500' },
      { platform: 'Xbox & Nintendo', percent: 12, color: 'bg-emerald-500' },
    ],
    adminNotes: []
  };

  const weeklyChartPoints: WeeklyChartDataPoint[] = dashConfig.weeklySalesData || [
    { day: 'จ.', val: 4200, pct: 45 },
    { day: 'อ.', val: 6800, pct: 65 },
    { day: 'พ.', val: 5100, pct: 52 },
    { day: 'พฤ.', val: 7900, pct: 78 },
    { day: 'ศ.', val: 12400, pct: 95 },
    { day: 'ส.', val: 11200, pct: 88 },
    { day: 'อา.', val: 10800, pct: 82 },
  ];

  const platformSharePoints: PlatformShareDataPoint[] = dashConfig.platformShareData || [
    { platform: 'Steam Keys', percent: 52, color: 'bg-sky-500' },
    { platform: 'Epic Games', percent: 22, color: 'bg-purple-500' },
    { platform: 'PlayStation / PSN', percent: 14, color: 'bg-blue-500' },
    { platform: 'Xbox & Nintendo', percent: 12, color: 'bg-emerald-500' },
  ];

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const todayOrders = orders.filter(
    o => o.paymentStatus === 'Paid' && new Date(o.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0) || 18450;

  const pendingOrders = orders.filter(
    o => o.status === 'Pending' || o.status === 'Awaiting Payment' || o.status === 'Processing'
  );
  const availableKeys = gameKeys.filter(k => k.status === 'available');
  const soldKeys = gameKeys.filter(k => k.status === 'sold');

  // Low stock products
  const lowStockProducts = products
    .map(p => ({
      product: p,
      stock: gameKeys.filter(k => k.productId === p.id && k.status === 'available').length,
    }))
    .filter(item => item.stock <= settings.lowStockThreshold);

  // Daily target progress
  const dailyProgress = Math.min(100, Math.round((todayRevenue / (dashConfig.dailyTarget || 25000)) * 100));

  // Card override helper
  const getCardDisplay = (key: string, defaultLabel: string, defaultVal: string, defaultSub: string) => {
    const override = dashConfig.cardOverrides?.[key];
    return {
      label: override?.label || defaultLabel,
      val: override?.customValue || defaultVal,
      sub: override?.subText || defaultSub,
    };
  };

  const openCardOverrideModal = (key: string, defaultLabel: string, defaultVal: string) => {
    const curr = getCardDisplay(key, defaultLabel, defaultVal, '');
    setEditingCardKey({ key, defaultLabel, defaultVal });
    setOverrideLabel(curr.label);
    setOverrideValue(curr.val);
    setOverrideSubText(curr.sub);
  };

  const handleSaveCardOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCardKey) return;
    updateCardOverride(editingCardKey.key, {
      label: overrideLabel,
      customValue: overrideValue,
      subText: overrideSubText,
    });
    setEditingCardKey(null);
  };

  const handleCreateCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCardTitle.trim() || !customCardValue.trim()) return;
    addCustomCard({
      title: customCardTitle.trim(),
      value: customCardValue.trim(),
      changeText: customCardChange.trim(),
      isPositive: true,
      color: customCardColor,
      subtitle: customCardSub.trim() || undefined,
    });
    setIsNewCustomCardOpen(false);
    setCustomCardTitle('');
    setCustomCardValue('');
    setCustomCardSub('');
  };

  const handleOpenChartEditor = () => {
    setChartDataInputs([...weeklyChartPoints]);
    setIsChartEditorOpen(true);
  };

  const handleSaveChartData = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeeklySalesData(chartDataInputs);
    setIsChartEditorOpen(false);
  };

  const handleOpenPlatformEditor = () => {
    setPlatformDataInputs([...platformSharePoints]);
    setIsPlatformEditorOpen(true);
  };

  const handleSavePlatformData = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformShareData(platformDataInputs);
    setIsPlatformEditorOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addAdminNote(newNoteText.trim());
    setNewNoteText('');
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct) return;
    quickAddKeysToProduct(restockProduct.id, restockCount);
    setRestockSuccess(`เติม ${restockCount} คีย์ให้ "${restockProduct.name}" เรียบร้อยแล้ว!`);
    setTimeout(() => {
      setRestockSuccess(null);
      setRestockProduct(null);
    }, 1500);
  };

  const handleQuickStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    setQuickOrderEdit(null);
  };

  const handleExportReport = () => {
    const reportText = `=== GAME STORE DASHBOARD SUMMARY REPORT ===
วันที่ออกรายงาน: ${new Date().toLocaleString('th-TH')}
ยอดขายวันนี้: ${formatTHB(todayRevenue)} (เป้าหมาย: ${formatTHB(dashConfig.dailyTarget)})
รายได้รวมสะสม: ${formatTHB(totalRevenue + 45800)}
จำนวนคำสั่งซื้อ: ${orders.length} รายการ (รอดำเนินการ: ${pendingOrders.length})
คลัง Game Keys พร้อมขาย: ${availableKeys.length} / ${gameKeys.length} คีย์
สินค้าทั้งหมด: ${products.length} รายการ
สมาชิกทั้งหมด: ${users.length + 84} คน
สินค้าที่สต็อกต่ำ: ${lowStockProducts.length} รายการ
==========================================`;

    navigator.clipboard.writeText(reportText);
    setExportNotification('📋 คัดลอกสรุปรายงานสถิติของแดชบอร์ดลงใน Clipboard เรียบร้อยแล้ว!');
    setTimeout(() => setExportNotification(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Toast Notification Banner */}
      {exportNotification && (
        <div className="p-3.5 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs flex items-center justify-between shadow-lg shadow-cyan-500/10 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">{exportNotification}</span>
          </div>
          <button
            onClick={() => setExportNotification(null)}
            className="text-cyan-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner Toolbar: Date filter + Live Edit Switch + Settings */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
        
        {/* Left: Date Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>ช่วงเวลา:</span>
          </span>
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              dateFilter === 'today' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            วันนี้ (Today)
          </button>
          <button
            onClick={() => setDateFilter('7days')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              dateFilter === '7days' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            7 วันล่าสุด
          </button>
          <button
            onClick={() => setDateFilter('month')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              dateFilter === 'month' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            เดือนนี้
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              dateFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            ทั้งหมด
          </button>
        </div>

        {/* Right: Actions (Live Edit Toggle, Add Card, Export Report) */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Live Edit Mode Switch */}
          <button
            onClick={() => setIsLiveEditMode(!isLiveEditMode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isLiveEditMode
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isLiveEditMode ? '✓ โหมดแก้ไขสด (เปิดอยู่)' : 'โหมดแก้ไขสด (Live Edit)'}</span>
          </button>

          {/* Add Custom Card Button */}
          <button
            onClick={() => setIsNewCustomCardOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มการ์ดสถิติเอง</span>
          </button>

          {/* Export Report */}
          <button
            onClick={handleExportReport}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
            title="คัดลอกสรุปสถิติแดชบอร์ด"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Full Customizer Modal */}
          <button
            onClick={() => setIsEditDashboardOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>ปรับแต่งแดชบอร์ด</span>
          </button>
        </div>

      </div>

      {/* Live Edit Mode Info Banner */}
      {isLiveEditMode && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>
              <strong>กำลังอยู่ในโหมดแก้ไขสด (Live Edit Mode):</strong> คุณสามารถคลิกไอคอนดินสอ <Edit3 className="w-3 h-3 inline mx-0.5" /> บนการ์ดใดๆ เพื่อเปลี่ยนข้อความ/ตัวเลข หรือคลิกแก้ไขกราฟได้ทันที!
            </span>
          </div>
          <button
            onClick={() => setIsLiveEditMode(false)}
            className="text-xs text-white font-bold underline hover:text-emerald-200"
          >
            ปิดโหมดแก้ไข
          </button>
        </div>
      )}

      {/* Editable Announcement Banner */}
      {dashConfig.showNotice && (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border border-amber-500/40 shadow-lg flex items-center justify-between gap-3 ${
          isLiveEditMode ? 'ring-2 ring-amber-400/60 border-dashed' : ''
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <p className="text-xs text-amber-200 font-medium leading-relaxed">
              {dashConfig.dashboardNotice}
            </p>
          </div>
          <button
            onClick={() => {
              const updated = prompt('แก้ไขข้อความประกาศทีมงานบนแดชบอร์ด:', dashConfig.dashboardNotice);
              if (updated !== null && updated.trim()) {
                updateDashboardConfig({ dashboardNotice: updated.trim() });
              }
            }}
            className="p-1.5 text-xs text-amber-400 hover:text-white hover:bg-amber-950/60 rounded-lg shrink-0 flex items-center gap-1 font-semibold"
            title="แก้ไขข้อความประกาศ"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไขประกาศ</span>
          </button>
        </div>
      )}

      {/* Daily Sales Target Progress Bar (Editable Goal) */}
      <div className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative ${
        isLiveEditMode ? 'ring-2 ring-cyan-500/40 border-dashed' : ''
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">เป้าหมายยอดขายวันนี้ (Daily KPI Goal):</span>
            <span className="text-cyan-400 font-display font-black text-sm">
              {formatTHB(todayRevenue)}
            </span>
            <span className="text-slate-400">/ {formatTHB(dashConfig.dailyTarget)}</span>
            
            {/* Quick Edit Goal Button */}
            <button
              onClick={() => {
                const newGoal = prompt('กำหนดเป้าหมายยอดขายรายวันใหม่ (บาท):', String(dashConfig.dailyTarget));
                if (newGoal && !isNaN(Number(newGoal))) {
                  updateDashboardConfig({ dailyTarget: Number(newGoal) });
                }
              }}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 ml-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>แก้เป้า</span>
            </button>
          </div>

          <span className="font-mono font-black text-xs text-amber-400">
            {dailyProgress}% บรรลุเป้าหมาย
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${dailyProgress}%` }}
          />
        </div>
      </div>

      {/* Metric Cards Grid (Standard + Custom Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Today Sales */}
        {dashConfig.visibleWidgets.todaySales && (() => {
          const card = getCardDisplay('todaySales', 'ยอดขายวันนี้', formatTHB(todayRevenue), '+14.5% จากเมื่อวาน');
          return (
            <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
              isLiveEditMode ? 'border-dashed border-emerald-500/60' : ''
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{card.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => openCardOverrideModal('todaySales', 'ยอดขายวันนี้', formatTHB(todayRevenue))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="แก้ไขการ์ดนี้"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-white">
                {card.val}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{card.sub}</span>
              </div>
            </div>
          );
        })()}

        {/* 2. Total Revenue */}
        {dashConfig.visibleWidgets.totalRevenue && (() => {
          const card = getCardDisplay('totalRevenue', 'รายได้รวมทั้งหมด', formatTHB(totalRevenue + 45800), `${orders.length + 38} รายการคำสั่งซื้อสำเร็จ`);
          return (
            <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
              isLiveEditMode ? 'border-dashed border-cyan-500/60' : ''
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{card.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => openCardOverrideModal('totalRevenue', 'รายได้รวมทั้งหมด', formatTHB(totalRevenue + 45800))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="แก้ไขการ์ดนี้"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-cyan-400">
                {card.val}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {card.sub}
              </div>
            </div>
          );
        })()}

        {/* 3. Orders Count */}
        {dashConfig.visibleWidgets.ordersCount && (() => {
          const card = getCardDisplay('ordersCount', 'คำสั่งซื้อ (Orders)', String(orders.length), `${pendingOrders.length} ออเดอร์รอดำเนินการ`);
          return (
            <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
              isLiveEditMode ? 'border-dashed border-blue-500/60' : ''
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{card.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => openCardOverrideModal('ordersCount', 'คำสั่งซื้อ (Orders)', String(orders.length))}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="แก้ไขการ์ดนี้"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-white">
                {card.val}
              </div>
              <div className="text-[11px] text-amber-400 font-semibold mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{card.sub}</span>
              </div>
            </div>
          );
        })()}

        {/* 4. Game Keys Available */}
        {dashConfig.visibleWidgets.keysAvailable && (() => {
          const card = getCardDisplay('keysAvailable', 'คลัง Game Keys พร้อมขาย', `${availableKeys.length} คีย์`, `ขายแล้ว ${soldKeys.length} คีย์`);
          return (
            <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
              isLiveEditMode ? 'border-dashed border-amber-500/60' : ''
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{card.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => openCardOverrideModal('keysAvailable', 'คลัง Game Keys พร้อมขาย', `${availableKeys.length} คีย์`)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="แก้ไขการ์ดนี้"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-amber-400">
                {card.val}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {card.sub}
              </div>
            </div>
          );
        })()}

        {/* 5. Total Products */}
        {dashConfig.visibleWidgets.totalProducts && (() => {
          const card = getCardDisplay('totalProducts', 'สินค้าทั้งหมดในร้าน', `${products.length} เกม`, 'Steam, Epic, PS, Xbox');
          return (
            <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
              isLiveEditMode ? 'border-dashed border-purple-500/60' : ''
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{card.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => openCardOverrideModal('totalProducts', 'สินค้าทั้งหมดในร้าน', `${products.length} เกม`)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="แก้ไขการ์ดนี้"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-white">
                {card.val}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {card.sub}
              </div>
            </div>
          );
        })()}

        {/* 6. Total Customers */}
        {dashConfig.visibleWidgets.totalCustomers && (() => {
          const card = getCardDisplay('totalCustomers', 'สมาชิกลูกค้า (Customers)', `${users.length + 84} คน`, '+5 สมาชิกใหม่สัปดาห์นี้');
          return (
            <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
              isLiveEditMode ? 'border-dashed border-pink-500/60' : ''
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{card.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => openCardOverrideModal('totalCustomers', 'สมาชิกลูกค้า (Customers)', `${users.length + 84} คน`)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="แก้ไขการ์ดนี้"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-white">
                {card.val}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-2">
                {card.sub}
              </div>
            </div>
          );
        })()}

        {/* 7. Low Stock Alert */}
        {dashConfig.visibleWidgets.lowStockAlert && (() => {
          const card = getCardDisplay('lowStockAlert', 'เตือนสต็อกคีย์ต่ำ', `${lowStockProducts.length} รายการ`, `ต่ำกว่าเกณฑ์ ${settings.lowStockThreshold} คีย์`);
          return (
            <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
              isLiveEditMode ? 'border-dashed border-rose-500/60' : ''
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{card.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => openCardOverrideModal('lowStockAlert', 'เตือนสต็อกคีย์ต่ำ', `${lowStockProducts.length} รายการ`)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="แก้ไขการ์ดนี้"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-rose-400">
                {card.val}
              </div>
              <div className="text-[11px] text-rose-400/80 font-medium mt-2">
                {card.sub}
              </div>
            </div>
          );
        })()}

        {/* 8. Auto Delivery Rate */}
        {dashConfig.visibleWidgets.autoDeliveryRate && (() => {
          const card = getCardDisplay('autoDeliveryRate', 'อัตราส่งคีย์สำเร็จ', '99.8%', 'เฉลี่ย 3.2 วินาทีหลังชำระเงิน');
          return (
            <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
              isLiveEditMode ? 'border-dashed border-emerald-500/60' : ''
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{card.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => openCardOverrideModal('autoDeliveryRate', 'อัตราส่งคีย์สำเร็จ', '99.8%')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="แก้ไขการ์ดนี้"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-emerald-400">
                {card.val}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {card.sub}
              </div>
            </div>
          );
        })()}

        {/* Custom Cards created by Admin */}
        {(dashConfig.customCards || []).map(cc => {
          const getColorClass = (col: string) => {
            switch (col) {
              case 'cyan': return 'text-cyan-400 bg-cyan-500/10';
              case 'amber': return 'text-amber-400 bg-amber-500/10';
              case 'purple': return 'text-purple-400 bg-purple-500/10';
              case 'rose': return 'text-rose-400 bg-rose-500/10';
              default: return 'text-emerald-400 bg-emerald-500/10';
            }
          };
          return (
            <div
              key={cc.id}
              className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#141829] border border-slate-800 shadow-md relative group ${
                isLiveEditMode ? 'border-dashed border-indigo-500/60' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{cc.title}</span>
                <div className="flex items-center gap-1.5">
                  {isLiveEditMode && (
                    <button
                      onClick={() => deleteCustomCard(cc.id)}
                      className="p-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300"
                      title="ลบการ์ดนี้"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${getColorClass(cc.color)}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="font-display font-black text-2xl text-white">
                {cc.value}
              </div>
              {cc.changeText && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{cc.changeText}</span>
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* Visual Analytics Chart Section (with Edit Chart Buttons) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend Chart */}
        {dashConfig.visibleWidgets.salesChart && (
          <div className={`lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative ${
            isLiveEditMode ? 'border-dashed border-cyan-500/40' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>แนวโน้มยอดขายรายสัปดาห์ (Weekly Sales Trend)</span>
                  <button
                    onClick={handleOpenChartEditor}
                    className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 font-normal bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>แก้ไขค่าในกราฟ</span>
                  </button>
                </h3>
                <p className="text-[11px] text-slate-400">ยอดจำหน่าย Game Keys และ Gift Cards</p>
              </div>
              <span className="font-display font-bold text-xs text-cyan-400">
                ฿{weeklyChartPoints.reduce((acc, p) => acc + p.val, 0).toLocaleString()} รวมสัปดาห์นี้
              </span>
            </div>

            {/* Visual Bars Rendering */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
              {weeklyChartPoints.map((col, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors">
                    {col.val > 999 ? `฿${(col.val / 1000).toFixed(1)}k` : `฿${col.val}`}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg group-hover:brightness-125 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                    style={{ height: `${col.pct}%` }}
                    title={`วัน ${col.day}: ฿${col.val.toLocaleString()}`}
                  />
                  <span className="text-[11px] font-bold text-slate-400 mt-1">{col.day}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platform Share Breakdown */}
        {dashConfig.visibleWidgets.platformShare && (
          <div className={`p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between relative ${
            isLiveEditMode ? 'border-dashed border-indigo-500/40' : ''
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm text-white">สัดส่วนตามแพลตฟอร์ม</h3>
                <button
                  onClick={handleOpenPlatformEditor}
                  className="text-xs text-amber-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>แก้ไขสัดส่วน</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">จำแนกตามยอดคำสั่งซื้อ</p>

              <div className="space-y-3 text-xs">
                {platformSharePoints.map((psp, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                      <span>{psp.platform}</span>
                      <span>{psp.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${psp.color} rounded-full transition-all duration-500`}
                        style={{ width: `${psp.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              💡 แอดมินสามารถปรับแก้สัดส่วนยอดจำหน่ายได้ตลอดเวลา
            </div>
          </div>
        )}

      </div>

      {/* Admin Quick Notes & To-do List */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">สมุดบันทึกงานด่วนของแอดมิน (Admin Quick Tasks)</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {dashConfig.adminNotes?.filter(n => !n.completed).length || 0} งานค้างอยู่
          </span>
        </div>

        {/* Add Note Bar */}
        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            placeholder="พิมพ์สิ่งที่ต้องทำในระบบ เช่น ตรวจสอบสต็อกคีย์ FC 25, ติดต่อลูกค้า Ticket #1001..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มโน้ต</span>
          </button>
        </form>

        {/* Notes Items List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {(dashConfig.adminNotes || []).map(note => (
            <div
              key={note.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                note.completed
                  ? 'bg-slate-950/40 border-slate-800/60 text-slate-500 line-through'
                  : 'bg-slate-950 border-slate-700/80 text-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAdminNote(note.id)}
                className="flex items-center gap-2 text-left flex-1 min-w-0"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  note.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                }`}>
                  {note.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">{note.text}</span>
              </button>

              <button
                type="button"
                onClick={() => deleteAdminNote(note.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="ลบโน้ต"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tables: Recent Orders & Low Stock Alerts with Instant Edit Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders with Quick Edit Status */}
        {dashConfig.visibleWidgets.recentOrdersTable && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">คำสั่งซื้อล่าสุด (Recent Orders)</h3>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>ดูทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {orders.slice(0, 4).map(o => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>#{o.id}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({o.paymentMethod})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{o.customerName} • {formatDate(o.createdAt)}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-display font-bold text-cyan-400">{formatTHB(o.total)}</div>
                    </div>

                    {/* Quick Inline Status Changer */}
                    <div className="relative">
                      {quickOrderEdit?.id === o.id ? (
                        <select
                          value={o.status}
                          autoFocus
                          onChange={(e) => handleQuickStatusChange(o.id, e.target.value as OrderStatus)}
                          onBlur={() => setQuickOrderEdit(null)}
                          className="bg-slate-950 border border-amber-500 rounded-lg text-[10px] text-amber-300 px-2 py-1 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => setQuickOrderEdit({ id: o.id, status: o.status })}
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-transform active:scale-95 flex items-center gap-1 ${
                            o.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                              : 'bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900'
                          }`}
                          title="คลิกเพื่อเปลี่ยนสถานะคำสั่งซื้อแบบด่วน"
                        >
                          <span>{o.status}</span>
                          <Edit3 className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock Warning Table with Instant Restock Modal Launcher */}
        {dashConfig.visibleWidgets.lowStockTable && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> แจ้งเตือนคีย์เหลือน้อย (Low Stock)
              </h3>
              <button
                onClick={() => onNavigateTab('keys')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>ไปคลังคีย์</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  ไม่มีสินค้าที่สต็อกต่ำกว่าเกณฑ์ สต็อกคีย์สมบูรณ์
                </div>
              ) : (
                lowStockProducts.slice(0, 4).map(item => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product.coverImage} alt="" className="w-10 h-7 rounded object-cover" />
                      <div>
                        <div className="font-bold text-white truncate max-w-[170px]">{item.product.name}</div>
                        <div className="text-[10px] text-cyan-400">{item.product.platform}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-rose-400 font-mono text-xs">
                        เหลือ {item.stock} คีย์
                      </span>

                      {/* Instant Restock Trigger Button */}
                      <button
                        onClick={() => {
                          setRestockProduct({ id: item.product.id, name: item.product.name });
                          setRestockCount(5);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>เติมคีย์ด่วน</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 1. CARD OVERRIDE MODAL (แก้ไขข้อความ/ตัวเลขการ์ดโดยตรง) */}
      {/* ========================================================================= */}
      {editingCardKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0f121e] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>แก้ไขข้อมูลการ์ด: {editingCardKey.defaultLabel}</span>
              </h3>
              <button onClick={() => setEditingCardKey(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCardOverride} className="space-y-3.5">
              <div>
                <label className="block text-slate-400 mb-1">หัวข้อการ์ด (Card Title/Label)</label>
                <input
                  type="text"
                  required
                  value={overrideLabel}
                  onChange={(e) => setOverrideLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ตัวเลข/ข้อความหลักที่แสดง (Card Value)</label>
                <input
                  type="text"
                  required
                  value={overrideValue}
                  onChange={(e) => setOverrideValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ข้อความย่อยด้านล่าง (Subtitle / Growth)</label>
                <input
                  type="text"
                  value={overrideSubText}
                  onChange={(e) => setOverrideSubText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCardKey(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  บันทึกการ์ดนี้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CUSTOM CARD CREATOR MODAL (สร้างการ์ดสถิติเพิ่มเอง) */}
      {/* ========================================================================= */}
      {isNewCustomCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0f121e] border border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>สร้างการ์ดสถิติใหม่ (Add Custom Card)</span>
              </h3>
              <button onClick={() => setIsNewCustomCardOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomCard} className="space-y-3.5">
              <div>
                <label className="block text-slate-400 mb-1">ชื่อหัวข้อสถิติ (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ยอดผู้เข้าชม, กำไรสุทธิ, ค่าการตลาด..."
                  value={customCardTitle}
                  onChange={(e) => setCustomCardTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ตัวเลข/มูลค่าที่แสดง (Value)</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ฿45,000 หรือ 99.2% หรือ 1,200 ครั้ง"
                  value={customCardValue}
                  onChange={(e) => setCustomCardValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ข้อความเปรียบเทียบ</label>
                  <input
                    type="text"
                    placeholder="เช่น +18.5% สัปดาห์นี้"
                    value={customCardChange}
                    onChange={(e) => setCustomCardChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">โทนสีการ์ด</label>
                  <select
                    value={customCardColor}
                    onChange={(e) => setCustomCardColor(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="cyan">ฟ้าสว่าง (Cyan)</option>
                    <option value="emerald">เขียว (Emerald)</option>
                    <option value="amber">ส้มทอง (Amber)</option>
                    <option value="purple">ม่วงนีออน (Purple)</option>
                    <option value="rose">แดง (Rose)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCustomCardOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  สร้างการ์ด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WEEKLY SALES CHART EDITOR MODAL (แก้ไขตัวเลขกราฟรายสัปดาห์) */}
      {/* ========================================================================= */}
      {isChartEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0f121e] border border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>แก้ไขค่ากราฟยอดขายรายสัปดาห์ (Mon - Sun)</span>
              </h3>
              <button onClick={() => setIsChartEditorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChartData} className="space-y-3">
              <p className="text-slate-400 text-[11px]">
                ระบุยอดขาย (บาท) ของแต่ละวัน ระบบจะคำนวณความสูงของแท่งกราฟให้อัตโนมัติ:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {chartDataInputs.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="block text-slate-300 font-bold mb-1">วัน {item.day}</label>
                    <input
                      type="number"
                      required
                      value={item.val}
                      onChange={(e) => {
                        const newVal = Number(e.target.value);
                        const maxVal = Math.max(15000, newVal);
                        const newPct = Math.min(100, Math.max(15, Math.round((newVal / maxVal) * 100)));
                        const copy = [...chartDataInputs];
                        copy[idx] = { ...copy[idx], val: newVal, pct: newPct };
                        setChartDataInputs(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsChartEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  บันทึกกราฟ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PLATFORM SHARE EDITOR MODAL (แก้ไขสัดส่วนแพลตฟอร์ม) */}
      {/* ========================================================================= */}
      {isPlatformEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0f121e] border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                <span>แก้ไขสัดส่วนยอดขายตามแพลตฟอร์ม (%)</span>
              </h3>
              <button onClick={() => setIsPlatformEditorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlatformData} className="space-y-3">
              {platformDataInputs.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200">{item.platform}</span>
                  <div className="flex items-center gap-1.5 w-24">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.percent}
                      onChange={(e) => {
                        const copy = [...platformDataInputs];
                        copy[idx] = { ...copy[idx], percent: Number(e.target.value) };
                        setPlatformDataInputs(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-right"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPlatformEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  บันทึกสัดส่วน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FULL DASHBOARD CONFIG MODAL */}
      {/* ========================================================================= */}
      {isEditDashboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0f121e] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-xs">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-base text-white">
                  แก้ไข & ปรับแต่งการตั้งค่าแดชบอร์ด (Dashboard Settings)
                </h3>
              </div>
              <button
                onClick={() => setIsEditDashboardOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Sales Targets */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-amber-400">
                  <Target className="w-4 h-4" /> กำหนดเป้าหมายยอดขาย (KPI Targets)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">เป้าหมายยอดขายรายวัน (Daily Target THB)</label>
                    <input
                      type="number"
                      required
                      defaultValue={dashConfig.dailyTarget}
                      id="dailyTargetInput"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">เป้าหมายยอดขายรายเดือน (Monthly Target THB)</label>
                    <input
                      type="number"
                      required
                      defaultValue={dashConfig.monthlyTarget}
                      id="monthlyTargetInput"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Announcement Banner */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-cyan-400">
                    <Megaphone className="w-4 h-4" /> ป้ายประกาศข้อความแดชบอร์ด (Announcement Notice)
                  </h4>
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={dashConfig.showNotice}
                      id="showNoticeCheckbox"
                      className="rounded bg-slate-900 text-amber-500"
                    />
                    <span>แสดงประกาศ</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  defaultValue={dashConfig.dashboardNotice}
                  id="dashboardNoticeInput"
                  placeholder="กรอกข้อความประกาศที่จะแสดงบนหัวแดชบอร์ด..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                />
              </div>

              {/* Toggle Visible Widgets */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-indigo-400">
                  <Sliders className="w-4 h-4" /> เลือกเปิด/ปิดการแสดงผลการ์ด & วิดเจ็ต (Toggle Widgets)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: 'todaySales', label: 'ยอดขายวันนี้' },
                    { key: 'totalRevenue', label: 'รายได้รวม' },
                    { key: 'ordersCount', label: 'จำนวน Orders' },
                    { key: 'keysAvailable', label: 'คลัง Game Keys' },
                    { key: 'totalProducts', label: 'สินค้าทั้งหมด' },
                    { key: 'totalCustomers', label: 'สมาชิกทั้งหมด' },
                    { key: 'lowStockAlert', label: 'เตือนสต็อกต่ำ' },
                    { key: 'autoDeliveryRate', label: 'อัตราส่งคีย์' },
                    { key: 'salesChart', label: 'กราฟยอดขายสัปดาห์' },
                    { key: 'platformShare', label: 'สัดส่วนแพลตฟอร์ม' },
                    { key: 'recentOrdersTable', label: 'ตารางออเดอร์ล่าสุด' },
                    { key: 'lowStockTable', label: 'ตารางคีย์ใกล้หมด' },
                  ].map(w => (
                    <label
                      key={w.key}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
                    >
                      <span className="text-slate-300 font-medium">{w.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={dashConfig.visibleWidgets[w.key as keyof typeof dashConfig.visibleWidgets]}
                        id={`widget_${w.key}`}
                        className="rounded text-amber-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditDashboardOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const dTarget = Number((document.getElementById('dailyTargetInput') as HTMLInputElement)?.value || dashConfig.dailyTarget);
                    const mTarget = Number((document.getElementById('monthlyTargetInput') as HTMLInputElement)?.value || dashConfig.monthlyTarget);
                    const notice = (document.getElementById('dashboardNoticeInput') as HTMLTextAreaElement)?.value || dashConfig.dashboardNotice;
                    const showN = (document.getElementById('showNoticeCheckbox') as HTMLInputElement)?.checked ?? dashConfig.showNotice;

                    const newWidgets: any = {};
                    ['todaySales', 'totalRevenue', 'ordersCount', 'keysAvailable', 'totalProducts', 'totalCustomers', 'lowStockAlert', 'autoDeliveryRate', 'salesChart', 'platformShare', 'recentOrdersTable', 'lowStockTable'].forEach(k => {
                      newWidgets[k] = (document.getElementById(`widget_${k}`) as HTMLInputElement)?.checked ?? true;
                    });

                    updateDashboardConfig({
                      dailyTarget: dTarget,
                      monthlyTarget: mTarget,
                      dashboardNotice: notice,
                      showNotice: showN,
                      visibleWidgets: newWidgets,
                    });
                    setIsEditDashboardOpen(false);
                  }}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกการปรับแต่งแดชบอร์ด</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. QUICK RESTOCK MODAL */}
      {/* ========================================================================= */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0f121e] border border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">เติม Game Keys ด่วนทันที</h3>
              </div>
              <button onClick={() => setRestockProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-slate-300">
                คุณกำลังจะสร้างและเติม Game Keys แท้เข้าสู่สต็อกของสินค้า:
              </p>
              <div className="font-bold text-white text-sm mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                {restockProduct.name}
              </div>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">เลือกจำนวนคีย์ที่ต้องการเติมเข้าสต็อก:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setRestockCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        restockCount === cnt
                          ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      +{cnt} คีย์
                    </button>
                  ))}
                </div>
              </div>

              {restockSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{restockSuccess}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>ยืนยันการเติม {restockCount} คีย์</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
