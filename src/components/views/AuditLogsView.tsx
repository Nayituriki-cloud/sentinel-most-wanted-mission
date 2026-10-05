import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Shield,
  Download,
  Lock,
  Calendar,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.officerBadge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Cryptographic Audit Trail & Access Logs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Immutable CJIS-compliant record of every case query, AI synthesis, citizen tip review, and evidence access with SHA-256 integrity checksums.
          </p>
        </div>

        <button
          onClick={() => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', dataStr);
            downloadAnchor.setAttribute('download', `sentinel_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search officer, badge, resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <select
          aria-label="Filter logs by action type"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono w-full sm:w-auto"
        >
          <option value="ALL">All Actions</option>
          <option value="CASE_VIEW">Case Views</option>
          <option value="TIP_ACCESSED">Tip Accessed</option>
          <option value="AI_QUERY">AI Queries</option>
          <option value="TASK_COMPLETED">Task Completed</option>
          <option value="REPORT_GENERATED">Report Generated</option>
        </select>
      </div>

      {/* Table of Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Officer / Badge</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4 text-right">Checksum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-100">{log.officerName}</div>
                    <div className="text-[10px] text-amber-400">{log.officerBadge}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-cyan-300 border border-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-semibold max-w-[200px] truncate">
                    {log.resourceTarget}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs font-sans max-w-[320px]">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 text-[10px] font-mono">
                    {log.cryptographicChecksum.substring(0, 8)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
