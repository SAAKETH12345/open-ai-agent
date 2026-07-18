/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HospitalView } from './components/HospitalView';
import { TestSuiteView } from './components/TestSuiteView';
import { SentinelResponse } from './types';
import { Shield, FileCode, Play, AlertCircle } from 'lucide-react';

const DEFAULT_DIRTY_CODE = `function processData(userInput) {
  // 1. SQL Injection vulnerability
  const query = "SELECT * FROM users WHERE name = '" + userInput + "'";
  db.execute(query);

  // 2. O(n^2) Time Complexity
  const results = [];
  for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data.length; j++) {
      if(data[i].id === data[j].parentId) {
        results.push(data[i]);
      }
    }
  }

  // 3. Memory leak (global array)
  globalCache.push(results);
  
  return results;
}`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_DIRTY_CODE);
  const [result, setResult] = useState<SentinelResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hospital' | 'tests'>('hospital');

  const handleAudit = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/audit-and-heal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errMsg = 'Failed to process request';
        try {
          const errData = JSON.parse(errText);
          errMsg = errData.error || errData.errorMessage || errData.message || JSON.stringify(errData);
        } catch (e) {
          errMsg = `Server Error: ${response.status} ${response.statusText} - ${errText.substring(0, 50)}`;
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-slate-300 font-sans overflow-hidden border-x border-white/10">
      {/* Header */}
      <header className="flex-none h-14 border-b border-white/10 bg-[#0f0f0f] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            SENTINEL <span className="text-blue-500 font-light italic uppercase text-sm ml-1">Engine v2.4</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-medium text-green-400 uppercase tracking-widest">GPT-5.6 Active</span>
           </div>
           
           <div className="h-4 w-[1px] bg-white/10"></div>
           
           <div className="flex bg-[#1a1a1a] rounded-md p-1 border border-white/5">
             <button 
                onClick={() => setActiveTab('hospital')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${activeTab === 'hospital' ? 'bg-white/10 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
              >
                HOSPITAL_VIEW
             </button>
             <button 
                onClick={() => setActiveTab('tests')}
                disabled={!result}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${activeTab === 'tests' ? 'bg-white/10 text-slate-200' : 'text-slate-500 hover:text-slate-300'} ${!result && 'opacity-50 cursor-not-allowed'}`}
              >
                TEST_SUITE
             </button>
           </div>
           
           <div className="h-4 w-[1px] bg-white/10"></div>

          <button
            onClick={handleAudit}
            disabled={isLoading || !code.trim()}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'ANALYZING...' : 'INITIALIZE SCAN'}
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2 flex items-center gap-3 text-red-400 font-mono text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'hospital' ? (
           <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Input Area (Visible in Hospital View) */}
              <aside className="w-full lg:w-72 flex flex-col border-r border-white/10 bg-[#0d0d0d] z-10">
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                  <FileCode size={16} className="text-slate-500" />
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Input Payload</label>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste vulnerable code here..."
                  className="flex-1 w-full bg-transparent p-6 font-mono text-[11px] text-slate-400 focus:outline-none resize-none custom-scrollbar"
                  spellCheck="false"
                />
              </aside>
              
              {/* Results Area */}
              <div className="flex-1 min-w-0 bg-black">
                <HospitalView originalCode={code} result={result} isLoading={isLoading} />
              </div>
           </div>
        ) : (
           <div className="flex-1 p-6 bg-black">
              <TestSuiteView result={result} />
           </div>
        )}
      </main>
    </div>
  );
}
