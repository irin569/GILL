import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, phone: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updateUserById: (userId: string, data: Partial<User>) => void;
  changePassword: (oldPass: string, newPass: string) => boolean;
  forgotPassword: (email: string) => boolean;
  switchDemoUser: (role: UserRole | 'guest') => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'all',
    'products.view', 'products.create', 'products.update', 'products.delete',
    'orders.view', 'orders.update', 'orders.refund',
    'customers.view', 'customers.update', 'customers.ban',
    'payments.view', 'refunds.manage',
    'reports.view',
    'settings.manage',
    'keys.view', 'keys.create', 'keys.update', 'keys.delete',
    'coupons.manage', 'promotions.manage', 'reviews.manage', 'tickets.manage', 'audit.view'
  ],
  admin: [
    'products.view', 'products.create', 'products.update', 'products.delete',
    'orders.view', 'orders.update', 'orders.refund',
    'customers.view', 'customers.update',
    'payments.view', 'refunds.manage',
    'reports.view',
    'keys.view', 'keys.create', 'keys.update',
    'coupons.manage', 'promotions.manage', 'reviews.manage', 'tickets.manage', 'audit.view'
  ],
  staff: [
    'products.view', 'products.update',
    'orders.view', 'orders.update',
    'customers.view',
    'keys.view', 'keys.create',
    'reviews.manage', 'tickets.manage'
  ],
  customer: []
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gamestore_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse users from localStorage', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gamestore_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse current_user', e);
      }
    }
    // Default to VIP Customer for realistic demo view
    return INITIAL_USERS[2];
  });

  useEffect(() => {
    localStorage.setItem('gamestore_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gamestore_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gamestore_current_user');
    }
  }, [currentUser]);

  const login = (email: string, forcedRole?: UserRole): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.isBanned) {
        return false;
      }
      const updated = { ...found, lastLogin: new Date().toISOString() };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === found.id ? updated : u));
      return true;
    }
    // If not found in demo, create customer on the fly
    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      name: email.split('@')[0],
      email: email.toLowerCase(),
      role: forcedRole || 'customer',
      phone: '080-000-0000',
      walletBalance: 1000,
      points: 50,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const register = (name: string, email: string, phone: string): boolean => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      name,
      email: email.toLowerCase(),
      role: 'customer',
      phone,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      walletBalance: 500, // Welcome bonus
      points: 50,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const updateUserById = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...data } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const changePassword = (_oldPass: string, _newPass: string): boolean => {
    return true;
  };

  const forgotPassword = (_email: string): boolean => {
    return true;
  };

  const switchDemoUser = (target: UserRole | 'guest') => {
    if (target === 'guest') {
      setCurrentUser(null);
      return;
    }
    const found = users.find(u => u.role === target);
    if (found) {
      setCurrentUser(found);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes('all') || permissions.includes(permission);
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
  const isStaff = currentUser?.role === 'staff' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        updateProfile,
        updateUserById,
        changePassword,
        forgotPassword,
        switchDemoUser,
        hasPermission,
        isAdmin,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
