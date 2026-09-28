import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Zap, Mail, MessageSquare } from 'lucide-react';
import { STORE_FAQS } from '../../data/initialData';

interface FaqPageProps {
  onOpenSupport: () => void;
  onBackToStore: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onOpenSupport, onBackToStore }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center mb-2 shadow-lg shadow-cyan-500/10">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
          ศูนย์ช่วยเหลือ & คำถามที่พบบ่อย (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          รวมคำตอบเกี่ยวกับวิธีการซื้อ การรับรหัส Game Key อัตโนมัติ นโยบายการรับประกัน และการเปิดใช้งาน
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {STORE_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <span className="font-bold text-sm text-white flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
                    Q
                  </span>
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Need more help CTA card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-center space-y-4">
        <h3 className="font-display font-bold text-lg text-white">
          ยังไม่พบคำตอบที่คุณต้องการ หรือพบปัญหาเกี่ยวกับคีย์?
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          ฝ่ายดูแลลูกค้าของเราพร้อมให้บริการและแก้ไขปัญหาตลอด 24 ชั่วโมง ผ่านระบบ Support Tickets
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onOpenSupport}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>เปิดคำร้อง Support Ticket</span>
          </button>
          <button
            onClick={onBackToStore}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            กลับสู่หน้าร้าน
          </button>
        </div>
      </div>

    </div>
  );
};
