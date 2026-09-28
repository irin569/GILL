import React, { useState } from 'react';
import { LifeBuoy, Search, Send, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SupportTicket } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AdminSupport: React.FC = () => {
  const { tickets, replyTicket, updateTicketStatus } = useStore();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyMessage, setReplyMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTickets = tickets.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;
    replyTicket(selectedTicket.id, replyMessage.trim());
    setReplyMessage('');
    // Update local selected ticket
    const updated = tickets.find(t => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="ค้นหา Ticket ID, ลูกค้า, หรือหัวข้อ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2"
        >
          <option value="all">ทุกสถานะ (All Tickets)</option>
          <option value="Open">Open (เปิดใหม่)</option>
          <option value="Pending">Pending (รอดำเนินการ)</option>
          <option value="Answered">Answered (ตอบแล้ว)</option>
          <option value="Closed">Closed (ปิดแล้ว)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ticket List Column */}
        <div className="lg:col-span-1 space-y-2.5 max-h-[600px] overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-slate-900/60 border border-slate-800">
              ไม่มีคำร้องตามเงื่อนไข
            </div>
          ) : (
            filteredTickets.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTicket?.id === t.id
                    ? 'bg-indigo-950/40 border-cyan-500 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">#{t.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    t.status === 'Answered'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span>{t.userName}</span>
                  <span>{formatDate(t.updatedAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ticket Chat & Reply Column */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-[600px]">
          {selectedTicket ? (
            <>
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white text-base">#{selectedTicket.id}</span>
                      <span className="text-xs font-bold text-slate-300">{selectedTicket.subject}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      ผู้ส่ง: {selectedTicket.userName} ({selectedTicket.userEmail}) • หมวดหมู่: {selectedTicket.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-2.5 py-1.5"
                    >
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Answered">Answered</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Message Thread */}
                <div className="space-y-3 overflow-y-auto max-h-[380px] pr-2">
                  {selectedTicket.messages.map(m => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl text-xs max-w-[85%] ${
                        m.sender === 'staff'
                          ? 'bg-amber-950/40 border border-amber-800/40 text-slate-200 ml-auto'
                          : 'bg-slate-950 border border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center justify-between gap-4">
                        <span className={m.sender === 'staff' ? 'text-amber-400' : 'text-cyan-400'}>
                          {m.senderName} ({m.sender === 'staff' ? 'เจ้าหน้าที่' : 'ลูกค้า'})
                        </span>
                        <span>{formatDate(m.timestamp)}</span>
                      </div>
                      <p className="leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="พิมพ์ข้อความตอบกลับในฐานะทีมงาน Support..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>ตอบกลับ</span>
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              เลือก Ticket เพื่อเปิดดูและตอบกลับ
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
