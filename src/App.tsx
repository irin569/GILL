import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/storefront/HeroBanner';
import { FlashSaleSection } from './components/storefront/FlashSaleSection';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CustomerDashboard } from './components/account/CustomerDashboard';
import { FaqPage } from './components/common/FaqPage';
import { AuthModal } from './components/auth/AuthModal';

// Admin Suite Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminKeys } from './components/admin/AdminKeys';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminSupport } from './components/admin/AdminSupport';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminSettings } from './components/admin/AdminSettings';

import { Product } from './types';

function MainApp() {
  const { currentUser, isStaff, isAdmin } = useAuth();
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsAuthModalOpen,
    setAuthModalTab,
  } = useStore();

  const [currentView, setCurrentView] = useState<'store' | 'account' | 'admin' | 'faq'>('store');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [targetKeyProductId, setTargetKeyProductId] = useState<string | undefined>(undefined);

  // If user tries to open admin without staff/admin privileges, redirect to admin login
  const handleAdminRequest = () => {
    if (isStaff) {
      setCurrentView('admin');
    } else {
      setAuthModalTab('admin');
      setIsAuthModalOpen(true);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductForModal(product);
  };

  const handleBuyNow = (product: Product) => {
    setSelectedProductForModal(null);
    setIsCheckoutOpen(true);
  };

  const handleNavigateToKeysFromProducts = (productId?: string) => {
    setTargetKeyProductId(productId);
    setAdminTab('keys');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a10] text-slate-100 font-['Kanit',sans-serif]">
      
      {/* If in Admin view and user is staff/admin */}
      {currentView === 'admin' && isStaff ? (
        <AdminLayout
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          onExitAdmin={() => setCurrentView('store')}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard onNavigateTab={(tab) => setAdminTab(tab)} />
          )}
          {adminTab === 'products' && (
            <AdminProducts onNavigateToKeys={handleNavigateToKeysFromProducts} />
          )}
          {adminTab === 'keys' && (
            <AdminKeys initialProductId={targetKeyProductId} />
          )}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'coupons' && <AdminCoupons />}
          {adminTab === 'reviews' && <AdminReviews />}
          {adminTab === 'support' && <AdminSupport />}
          {adminTab === 'audit' && <AdminAuditLogs />}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      ) : (
        /* Regular Storefront / Account / FAQ Views */
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={(view) => {
              if (view === 'admin') {
                handleAdminRequest();
              } else {
                setCurrentView(view);
              }
            }}
          />

          <main className="flex-1">
            {currentView === 'store' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Showcase */}
                <HeroBanner onSelectProduct={handleSelectProduct} />

                {/* Flash Sale Banner with Live Timer */}
                <FlashSaleSection onSelectProduct={handleSelectProduct} />

                {/* Filterable Catalog */}
                <ProductGrid onSelectProduct={handleSelectProduct} />
              </div>
            )}

            {currentView === 'account' && (
              <CustomerDashboard
                onSelectProduct={handleSelectProduct}
                onBackToStore={() => setCurrentView('store')}
              />
            )}

            {currentView === 'faq' && (
              <FaqPage
                onOpenSupport={() => setCurrentView('account')}
                onBackToStore={() => setCurrentView('store')}
              />
            )}
          </main>

          <Footer
            setCurrentView={(view) => {
              if (view === 'admin') {
                handleAdminRequest();
              } else {
                setCurrentView(view);
              }
            }}
          />
        </>
      )}

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onViewMyOrders={() => {
          setIsCheckoutOpen(false);
          setCurrentView('account');
        }}
      />

      <AuthModal
        onSuccess={() => {}}
        onAdminLoginSuccess={() => setCurrentView('admin')}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <MainApp />
      </StoreProvider>
    </AuthProvider>
  );
}
