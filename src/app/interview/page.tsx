"use client";

import React, { useState } from "react";
import { interviewQuestions } from "@/data/interviewQuestions";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Target, Search, ChevronDown, Check, Copy } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const MODULES = [
  { id: "all", label: "All Modules" },
  { id: "selenium-webdriver", label: "Selenium" },
  { id: "rest-assured", label: "REST Assured" },
  { id: "appium", label: "Appium" },
  { id: "rest-soap-wsdl", label: "REST/SOAP" },
  { id: "performance-testing", label: "Performance" },
  { id: "general-sdet", label: "General SDET" },
];

const LEVELS = [
  "all", "basic", "intermediate", "advanced", "scenario", 
  "coding", "mcq", "rapid-fire", "company-specific", "behavioral"
];

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="code-block my-4">
      <SyntaxHighlighter
        language="java"
        style={oneDark}
        customStyle={{ background: "transparent", margin: 0, padding: "16px", fontSize: "13px" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function InterviewPage() {
  const [activeModule, setActiveModule] = useState("all");
  const [activeLevel, setActiveLevel] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = interviewQuestions.filter((q) => {
    const matchModule = activeModule === "all" || q.moduleId === activeModule;
    const matchLevel = activeLevel === "all" || q.level === activeLevel;
    const matchSearch = q.question.toLowerCase().includes(search.toLowerCase()) || 
                        q.answer.toLowerCase().includes(search.toLowerCase());
    return matchModule && matchLevel && matchSearch;
  });

  const handleCopy = (q: typeof interviewQuestions[0]) => {
    navigator.clipboard.writeText(`Q: ${q.question}\n\nA: ${q.answer}`);
    toast.success("Question & Answer copied!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full px-4 py-1.5 text-sm mb-4">
          <Target className="w-3.5 h-3.5" />
          Interview Preparation Hub
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Master the Interview</h1>
        <p className="text-white/50 text-lg">Browse comprehensive questions tailored for SDET roles.</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-8 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-9 py-2.5 w-full"
          />
        </div>

        {/* Level Tabs */}
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border",
                activeLevel === lvl
                  ? "bg-white/[0.1] border-white/20 text-white"
                  : "bg-transparent border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
              )}
            >
              {lvl.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Module Filters */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.05]">
          {MODULES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs transition-all border",
                activeModule === m.id
                  ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                  : "bg-transparent border-white/[0.05] text-white/50 hover:border-white/[0.15]"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-white/40 mb-4">{filtered.length} questions found</div>

      {/* Questions Grid */}
      <div className="space-y-4">
        {filtered.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div key={q.id} className="glass-card border border-white/[0.07] overflow-hidden transition-all duration-300">
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/[0.02]"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                      {q.level.replace("-", " ")}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.1]">
                      {MODULES.find((m) => m.id === q.moduleId)?.label}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white/90 leading-relaxed">{q.question}</h3>
                </div>
                <ChevronDown className={clsx("w-5 h-5 text-white/30 transition-transform mt-1", isExpanded && "rotate-180")} />
              </button>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-white/[0.05] bg-white/[0.01]">
                  <div className="flex justify-end mb-3 mt-3">
                    <button
                      onClick={() => handleCopy(q)}
                      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>

                  {q.level === "mcq" && q.options ? (
                    <div className="space-y-2 mb-4">
                      {q.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={clsx(
                            "p-3 rounded-lg border text-sm",
                            idx === q.correctOption
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : "border-white/[0.05] bg-white/[0.02] text-white/60"
                          )}
                        >
                          {String.fromCharCode(65 + idx)}. {opt}
                          {idx === q.correctOption && <Check className="inline-block w-4 h-4 ml-2 text-emerald-400" />}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="prose prose-invert max-w-none text-sm text-white/70 leading-relaxed space-y-4">
                    {q.answer.split('\n\n').map((para, i) => {
                      if (para.startsWith('**') && para.includes('**')) {
                        return <div key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                      }
                      return <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                    })}
                  </div>

                  {q.codeExample && <CodeBlock code={q.codeExample} />}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">No questions match your filters.</div>
        )}
      </div>
    </div>
  );
}
