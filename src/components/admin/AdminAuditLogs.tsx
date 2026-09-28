import React, { useState } from 'react';
import { FileText, Search, Shield, User, Clock, Filter, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../utils/formatters';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.userName.toLowerCase().includes(search.toLowerCase()) ||
    log.target.toLowerCase().includes(search.toLowerCase()) ||
    log.ip.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">บันทึกการกระทำในระบบ (System Audit Trail)</h2>
          <p className="text-xs text-slate-400">บันทึกทุกการเปลี่ยนแปลงเพื่อความโปร่งใสและความปลอดภัย</p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="ค้นหา Action, ชื่อแอดมิน, Target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">วันและเวลา</th>
                <th className="py-3 px-4">ผู้ดำเนินการ (User)</th>
                <th className="py-3 px-4">การกระทำ (Action)</th>
                <th className="py-3 px-4">เป้าหมาย (Target)</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">รายละเอียดเพิ่มเติม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    ไม่พบบันทึกตามคำค้นหา
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{log.userName}</div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 uppercase font-semibold">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-200 max-w-xs truncate">
                      {log.target}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.ip}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {log.before && log.after ? (
                        <span className="text-amber-400/90 font-mono text-[10px]">
                          มีการแก้ไขค่าข้อมูล
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
