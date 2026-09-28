import React from 'react';
import { Gamepad2, Shield, Zap, RefreshCw, Mail, Phone, Lock, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  setCurrentView: (view: 'store' | 'account' | 'admin' | 'faq') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const { setSelectedCategory, setSelectedPlatform } = useStore();

  return (
    <footer className="bg-[#080910] border-t border-slate-800 text-slate-400 text-sm mt-20">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">จัดส่งทันที 24 ชม.</h4>
                <p className="text-xs text-slate-400">ระบบส่ง Game Key อัตโนมัติใน 3 วินาที</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">คีย์แท้ 100% รับประกัน</h4>
                <p className="text-xs text-slate-400">ใช้งานได้แน่นอน ไม่โดนดึงคืน</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">ชำระเงินปลอดภัย</h4>
                <p className="text-xs text-slate-400">สแกน PromptPay, บัตรเครดิต ไร้ค่าธรรมเนียม</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">บริการหลังการขาย</h4>
                <p className="text-xs text-slate-400">ทีม Support ดูแลแก้ปัญหาตลอดวัน</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-[#0d101d] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-bold text-xl tracking-wider text-white">
                GAME<span className="text-cyan-400">STORE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              แพลตฟอร์มจำหน่ายเกมออนไลน์ Digital License, Game Keys, Steam Wallet และ Gift Card แท้ ราคาประหยัด พร้อมระบบหลังบ้านและคลังสินค้าอัตโนมัติที่ครบวงจร
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>support@gamestore.local</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>02-888-9999 (09:00 - 24:00 น.)</span>
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">แพลตฟอร์ม</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setSelectedPlatform('Steam'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Steam Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedPlatform('Epic Games'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Epic Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedPlatform('PlayStation'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  PlayStation (PSN)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedPlatform('Xbox'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Xbox Game Pass
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedPlatform('Nintendo'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Nintendo Switch
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">หมวดหมู่สินค้า</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setSelectedCategory('Game Key'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Game Keys
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('Gift Card'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Steam & PSN Gift Cards
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('Bundle'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Game Bundles & Editions
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('Game Top-up'); setCurrentView('store'); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  บัตรเติมเงินและ Point
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  คำถามที่พบบ่อย (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Payment Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">ช่องทางชำระเงิน</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px]">
                PromptPay
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px]">
                Visa / Master
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px]">
                TrueMoney
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px]">
                Bank Transfer
              </span>
            </div>
            <div className="pt-2 text-[11px] text-slate-500">
              ระบบตรวจสอบยอดเงินและออกคีย์อัตโนมัติตลอด 24 ชม.
            </div>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-10 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">ข้อความชี้แจงสิทธิ์และเครื่องหมายการค้า:</p>
          <p>
            GAME STORE จำหน่าย Digital Product และใบอนุญาตซอฟต์แวร์ (License Key) ที่ถูกต้องตามกฎหมาย เครื่องหมายการค้า ชื่อเกม โลโก้ และเนื้อหาลิขสิทธิ์ทั้งหมด เช่น Steam, Epic Games, PlayStation, Xbox, Nintendo, Rockstar Games, CD PROJEKT RED ฯลฯ เป็นทรัพย์สินของเจ้าของลิขสิทธิ์แต่ละราย ทางร้านมิได้แอบอ้างสิทธิ์เป็นตัวแทนจำหน่ายอย่างเป็นทางการเว้นแต่จะได้รับความยินยอมเป็นลายลักษณ์อักษร
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} GAME STORE. All rights reserved. Full-stack Gaming Platform.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              สร้างด้วย <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> เพื่อเกมเมอร์ทุกคน
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
