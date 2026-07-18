import React, { useMemo } from 'react';
import { diffLines, Change } from 'diff';

interface CodeDiffProps {
  originalCode: string;
  healedCode: string;
  side: 'left' | 'right';
}

export function CodeDiff({ originalCode, healedCode, side }: CodeDiffProps) {
  const changes = useMemo(() => {
    return diffLines(originalCode || '', healedCode || '');
  }, [originalCode, healedCode]);

  return (
    <pre className="font-mono text-[11px] text-slate-300 whitespace-pre bg-[#050505] rounded-lg border border-white/10 overflow-x-auto m-0 p-0">
      <div className="table w-full border-collapse">
        {changes.map((part: Change, index: number) => {
          // If we are on the left side, we skip 'added' lines
          if (side === 'left' && part.added) return null;
          // If we are on the right side, we skip 'removed' lines
          if (side === 'right' && part.removed) return null;

          const colorClass = 
            part.added ? 'bg-emerald-900/30 text-emerald-300' :
            part.removed ? 'bg-red-900/30 text-red-300' : 'text-slate-400';

          const indicator = part.added ? '+' : part.removed ? '-' : ' ';
          
          const lines = part.value.replace(/\n$/, '').split('\n');

          return lines.map((line, i) => (
            <div key={`${index}-${i}`} className={`table-row ${colorClass}`}>
              <div className="table-cell whitespace-pre px-2 py-0.5 select-none opacity-50 border-r border-white/5 w-6 text-center">
                {indicator}
              </div>
              <div className="table-cell whitespace-pre px-4 py-0.5">
                {line}
              </div>
            </div>
          ));
        })}
      </div>
    </pre>
  );
}
