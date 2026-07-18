import React from 'react';
import { History, ChevronLeft, Clock, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { SentinelResponse } from '../types';

export type HistoryItem = {
  id: string;
  timestamp: number;
  code: string;
  result: SentinelResponse;
};

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  activeId?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function HistorySidebar({ history, onSelect, activeId, isOpen, onToggle }: HistorySidebarProps) {
  if (!isOpen) {
    return (
      <aside className="w-12 flex-none border-r border-white/10 bg-[#080808] flex flex-col items-center py-4 z-20">
        <button onClick={onToggle} className="text-slate-400 hover:text-white p-2 rounded hover:bg-white/5 transition-colors" title="Open History">
          <History size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 flex-none border-r border-white/10 bg-[#080808] flex flex-col z-20 transition-all">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={16} className="text-slate-400" />
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Scan History</h2>
        </div>
        <button onClick={onToggle} className="text-slate-500 hover:text-white p-1 rounded hover:bg-white/5 transition-colors">
          <ChevronLeft size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-center p-4 text-xs font-mono text-slate-600">
            No past scans found.
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3 rounded-lg border transition-colors flex flex-col gap-2 ${
                activeId === item.id 
                  ? 'bg-blue-900/20 border-blue-500/30' 
                  : 'bg-[#111] border-white/5 hover:border-white/10 hover:bg-[#151515]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock size={12} />
                  {format(item.timestamp, 'HH:mm')}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <span className={`px-1.5 py-0.5 rounded ${
                    item.result.analysis.overallSeverity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                    item.result.analysis.overallSeverity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                    item.result.analysis.overallSeverity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {item.result.analysis.overallSeverityScore}/100
                  </span>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-300 line-clamp-2 overflow-hidden opacity-70">
                {item.code}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
