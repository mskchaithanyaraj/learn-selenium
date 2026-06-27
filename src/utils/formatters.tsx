import React from 'react';

const renderInlineCode = (text: string) => {
  return text.split(/(`.*?`)/g).map((codePart, k) => {
    if (codePart.startsWith('`') && codePart.endsWith('`') && codePart.length > 1) {
      return (
        <code key={k} className="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-emerald-300 font-mono text-[13px] font-normal">
          {codePart.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={k}>{codePart}</React.Fragment>;
  });
};

export function formatAnswerText(text: string) {
  if (!text) return null;
  
  // Split by code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, partIdx) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.replace(/^```.*\n?/, '').replace(/\n?```$/, '');
      return (
        <div key={`code-${partIdx}`} className="my-3 text-left w-full overflow-hidden">
          <pre className="p-4 rounded-xl bg-black/50 border border-white/[0.05] overflow-x-auto text-[13px] leading-relaxed font-mono text-emerald-300">
            <code>{code}</code>
          </pre>
        </div>
      );
    }
    
    // Process text for tables and bold
    const lines = part.split('\n');
    const elements: React.ReactNode[] = [];
    let currentBlock: string[] = [];
    let inTable = false;

    const flushBlock = () => {
      if (currentBlock.length === 0) return;
      const content = currentBlock.join('\n');
      
      if (inTable) {
        elements.push(
          <div key={`block-${elements.length}`} className="my-4 w-full overflow-x-auto">
            <pre className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[13px] font-mono text-white/80 leading-snug w-max min-w-full">
              {content}
            </pre>
          </div>
        );
      } else {
        elements.push(
          <span key={`block-${elements.length}`} className="whitespace-pre-wrap block">
            {content.split(/(\*\*.*?\*\*)/g).map((subPart, j) => {
              if (subPart.startsWith('**') && subPart.endsWith('**')) {
                return (
                  <strong key={j} className="text-white font-semibold">
                    {renderInlineCode(subPart.slice(2, -2))}
                  </strong>
                );
              }
              return (
                <span key={j}>
                  {renderInlineCode(subPart)}
                </span>
              );
            })}
          </span>
        );
      }
      currentBlock = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // A line is considered part of a table if it starts with | and contains at least one more |
      const isTableLine = line.trim().startsWith('|') && line.indexOf('|', 1) !== -1;
      
      if (isTableLine !== inTable) {
        flushBlock();
        inTable = isTableLine;
      }
      currentBlock.push(line);
    }
    flushBlock();
    
    return <React.Fragment key={`part-${partIdx}`}>{elements}</React.Fragment>;
  });
}
