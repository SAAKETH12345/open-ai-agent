import React from 'react';
import { Issue, SentinelResponse } from '../types';
import { Activity, AlertTriangle, CheckCircle, ShieldAlert, Terminal } from 'lucide-react';
import Markdown from 'react-markdown';

interface HospitalViewProps {
  originalCode: string;
  result: SentinelResponse | null;
  isLoading: boolean;
}

export function HospitalView({ originalCode, result, isLoading }: HospitalViewProps) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full min-h-0 overflow-y-auto custom-scrollbar">
      {/* Dirty Code Panel */}
      <div className="flex flex-col bg-[#0d0d0d] rounded-xl border border-white/10 overflow-hidden">
        <div className="px-4 py-3 bg-[#111] border-b border-white/10 flex items-center gap-2">
          <Terminal size={16} className="text-slate-400" />
          <h2 className="font-display font-medium text-sm text-slate-300 uppercase tracking-wider">Vulnerable Code</h2>
        </div>
        <div className="flex-1 p-4 overflow-auto custom-scrollbar">
          <pre className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap">{originalCode || '// Enter code to analyze...'}</pre>
        </div>
      </div>

      {/* Healed Code Panel */}
      <div className="flex flex-col bg-[#0d0d0d] rounded-xl border border-white/10 overflow-hidden relative">
        <div className="px-4 py-3 bg-[#111] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-emerald-500" />
            <h2 className="font-display font-medium text-sm text-emerald-500 uppercase tracking-wider">Sentinel-Healed Code</h2>
          </div>
          {result && (
            <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-2 py-1 rounded">
              <span className="text-slate-400">Severity:</span>
              <SeverityBadge severity={result.analysis.overallSeverity} />
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4 overflow-auto relative custom-scrollbar">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d0d]/80 backdrop-blur-sm z-10">
              <Activity className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="font-mono text-sm text-blue-500 animate-pulse">Running Sentinel Engine...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-display text-slate-500 uppercase tracking-widest mb-2 italic">Repaired Code</h3>
                <pre className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap bg-[#050505] p-4 rounded-lg border border-white/10">
                  {result.healData.healedCode}
                </pre>
              </div>

              <div>
                <h3 className="text-xs font-display text-slate-500 uppercase tracking-widest mb-2 italic">Audit Report</h3>
                <div className="bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <span className="font-mono text-xs text-slate-400">Score: {result.analysis.overallSeverityScore}/100</span>
                  </div>
                  <ul className="divide-y divide-white/5">
                    {result.analysis.issues.map((issue, idx) => (
                      <li key={idx} className="p-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[11px] font-bold text-slate-200">{issue.type}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">{issue.description}</p>
                          </div>
                          <SeverityBadge severity={issue.severity} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-500 font-mono text-sm">
                // Awaiting analysis...
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Issue['severity'] }) {
  const colors = {
    Low: 'text-lumina-success bg-lumina-success/10 border-lumina-success/20',
    Medium: 'text-lumina-warning bg-lumina-warning/10 border-lumina-warning/20',
    High: 'text-lumina-danger bg-lumina-danger/10 border-lumina-danger/20',
    Critical: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  const Icon = severity === 'Low' ? CheckCircle : AlertTriangle;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-wider ${colors[severity]}`}>
      <Icon size={10} />
      {severity}
    </span>
  );
}
