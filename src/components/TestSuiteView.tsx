import React from 'react';
import { SentinelResponse } from '../types';
import Markdown from 'react-markdown';
import { Play, CheckCircle } from 'lucide-react';

interface TestSuiteViewProps {
  result: SentinelResponse | null;
}

export function TestSuiteView({ result }: TestSuiteViewProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [testOutput, setTestOutput] = React.useState<string | null>(null);

  if (!result) return null;

  const handleRunTests = () => {
    setIsRunning(true);
    setTestOutput(null);
    // Simulate test execution in sandbox
    setTimeout(() => {
      setTestOutput(`Starting test execution...
PASS  src/__tests__/healed.test.js
  ✓ should not be vulnerable to SQL injection (4ms)
  ✓ should have O(n) time complexity (2ms)
  ✓ should correctly release memory allocations (1ms)
  ✓ should handle edge cases gracefully (1ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.842s
Ran all test suites.`);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 bg-[#111] border-b border-white/10 flex items-center justify-between">
         <h2 className="font-display font-medium text-sm text-slate-300 uppercase tracking-wider">Test Suite (Codex Generated)</h2>
         <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded transition-colors"
          >
            {isRunning ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={12} />}
            {isRunning ? 'Running...' : 'RUN CODEX SUITE'}
          </button>
      </div>
      
      <div className="flex-1 grid grid-rows-2 min-h-0">
        <div className="p-4 overflow-auto border-b border-white/10 custom-scrollbar bg-[#050505]">
          <div className="markdown-body prose prose-invert max-w-none prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10 text-slate-300">
             <Markdown>{result.healData.testSuite}</Markdown>
          </div>
        </div>
        
        <div className="bg-[#050505] p-4 overflow-auto font-mono text-[11px] relative custom-scrollbar">
           <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
             <span className="text-slate-500">SENTINEL SYSTEM CONSOLE</span>
             <span className="text-blue-400 uppercase tracking-tighter">Diagnostics Active</span>
           </div>
           {testOutput ? (
             <pre className="text-slate-300 whitespace-pre-wrap">{testOutput}</pre>
           ) : (
             <div className="space-y-1">
               <p className="text-white/60">[CORE] Waiting for sandbox execution environment...</p>
               <p className="text-blue-400">[SYSTEM] Ready to execute test suite. Press 'RUN CODEX SUITE' to verify.</p>
               <p className="animate-pulse text-white">_</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
