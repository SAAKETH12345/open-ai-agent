import React, { useMemo, useState, useEffect } from 'react';
import { Issue, SentinelResponse } from '../types';
import { Activity, AlertTriangle, CheckCircle, ShieldAlert, Terminal, Download, FileText } from 'lucide-react';
import Markdown from 'react-markdown';
import { CodeDiff } from './CodeDiff';

interface HospitalViewProps {
  code: string;
  setCode: (code: string) => void;
  result: SentinelResponse | null;
  isLoading: boolean;
}

export function HospitalView({ code, setCode, result, isLoading }: HospitalViewProps) {
  const [isEditMode, setIsEditMode] = useState(!result);

  useEffect(() => {
    if (result) setIsEditMode(false);
    else setIsEditMode(true);
  }, [result]);

  const downloadMarkdown = () => {
    if (!result) return;
    
    let md = `# Sentinel Engine - Audit Report\n\n`;
    md += `**Overall Severity:** ${result.analysis.overallSeverity} (Score: ${result.analysis.overallSeverityScore}/100)\n\n`;
    
    md += `## Vulnerabilities Identified\n\n`;
    result.analysis.issues.forEach(issue => {
      md += `### [${issue.severity}] ${issue.type}\n`;
      md += `${issue.description}\n\n`;
    });
    
    md += `## Original Code\n\`\`\`javascript\n${code}\n\`\`\`\n\n`;
    md += `## Healed Code\n\`\`\`javascript\n${result.healData.healedCode}\n\`\`\`\n\n`;
    md += `## Test Suite\n\`\`\`javascript\n${result.healData.testSuite}\n\`\`\`\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-audit-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const typeDistribution = useMemo(() => {
    if (!result) return [];
    const counts: Record<string, number> = {};
    result.analysis.issues.forEach(issue => {
      // Simplify type for categorization (e.g., "OWASP: Injection" -> "Security")
      const cat = issue.type.toLowerCase().includes('owasp') ? 'Security' :
                  issue.type.toLowerCase().includes('big o') || issue.type.toLowerCase().includes('complexity') ? 'Performance' :
                  issue.type.toLowerCase().includes('memory') ? 'Memory' : 'Logic';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const total = result.analysis.issues.length;
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      percent: Math.round((count / total) * 100)
    }));
  }, [result]);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full min-h-0 overflow-y-auto custom-scrollbar">
      {/* Dirty Code Panel */}
      <div className="flex flex-col bg-[#0d0d0d] rounded-xl border border-white/10 overflow-hidden">
        <div className="px-4 py-3 bg-[#111] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-slate-400" />
            <h2 className="font-display font-medium text-sm text-slate-300 uppercase tracking-wider">Vulnerable Code</h2>
          </div>
          {result && (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditMode(true)}
                className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${isEditMode ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                EDIT MODE
              </button>
              <button 
                onClick={() => setIsEditMode(false)}
                className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${!isEditMode ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                DIFF VIEW
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 relative overflow-auto custom-scrollbar">
          {(!result || isEditMode) ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste vulnerable code here..."
              className="absolute inset-0 w-full h-full bg-transparent text-[11px] font-mono text-slate-300 p-4 focus:outline-none resize-none custom-scrollbar"
              spellCheck="false"
            />
          ) : (
            <div className="p-4">
              <CodeDiff originalCode={code} healedCode={result.healData.healedCode} side="left" />
            </div>
          )}
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
            <div className="flex items-center gap-3">
              <button
                onClick={downloadMarkdown}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono transition-colors text-slate-300"
                title="Download Markdown Report"
              >
                <Download size={14} />
                <span>Export</span>
              </button>
              <div className="flex items-center gap-2 text-xs font-mono bg-white/5 px-2 py-1 rounded">
                <span className="text-slate-400">Severity:</span>
                <SeverityBadge severity={result.analysis.overallSeverity} />
              </div>
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
              
              {/* Summary Card */}
              <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} className="text-slate-400" />
                  <h3 className="text-[11px] font-display text-slate-400 uppercase tracking-widest italic">Vulnerability Distribution</h3>
                </div>
                <div className="space-y-3">
                  {typeDistribution.map(dist => (
                    <div key={dist.type} className="flex items-center gap-3">
                      <div className="w-20 text-[10px] font-mono text-slate-400">{dist.type}</div>
                      <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden flex">
                        <div 
                          className={`h-full rounded-full ${
                            dist.type === 'Security' ? 'bg-red-500' :
                            dist.type === 'Performance' ? 'bg-orange-500' :
                            dist.type === 'Memory' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${dist.percent}%` }}
                        />
                      </div>
                      <div className="w-8 text-right text-[10px] font-mono text-slate-500">{dist.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-display text-slate-500 uppercase tracking-widest mb-2 italic">Repaired Code</h3>
                <CodeDiff originalCode={code} healedCode={result.healData.healedCode} side="right" />
              </div>

              <div>
                <h3 className="text-[11px] font-display text-slate-500 uppercase tracking-widest mb-2 italic">Audit Report</h3>
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
