"use client";

import React, { useState } from "react";
import { allTopics, modules } from "@/data/syllabus";
import { getTopicContent } from "@/data/moduleContent";
import { CheckCircle2, FileText, Zap, ChevronRight, BookOpen } from "lucide-react";
import clsx from "clsx";

const TABS = [
  { id: "one-liners", label: "One-liners", icon: Zap },
  { id: "cheat-sheets", label: "Cheat Sheets", icon: FileText },
  { id: "key-points", label: "Key Points", icon: CheckCircle2 },
];

export default function RevisionPage() {
  const [activeTab, setActiveTab] = useState("one-liners");
  const [activeModule, setActiveModule] = useState("all");

  const topicsWithContent = allTopics.map(t => {
    const content = getTopicContent(t.id);
    return { ...t, content };
  }).filter(t => t.content && (activeModule === "all" || t.moduleId === activeModule));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quick Revision</h1>
        <p className="text-white/50 text-sm">Review core concepts rapidly before your interview.</p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white/[0.1] text-white shadow-sm"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={activeModule}
          onChange={(e) => setActiveModule(e.target.value)}
          className="input-dark w-full sm:w-64"
        >
          <option value="all">All Modules</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>{m.title.replace(/^\d+\.\s*/, "")}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {activeTab === "one-liners" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicsWithContent.map((topic) => (
            <div key={topic.id} className="glass-card p-5 border border-white/[0.07] hover:border-blue-500/30 transition-colors">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{topic.moduleTitle.replace(/^\d+\.\s*/, "")}</div>
              <h3 className="text-sm font-semibold text-white mb-2">{topic.title}</h3>
              <p className="text-xs text-blue-300/80 leading-relaxed font-mono bg-blue-500/10 p-3 rounded-lg">
                {topic.content!.revisionSummary}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "key-points" && (
        <div className="space-y-6">
          {topicsWithContent.slice(0, 15).map((topic) => (
            <div key={topic.id} className="glass-card p-6 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">{topic.title}</h3>
              </div>
              <ul className="space-y-2">
                {topic.content!.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === "cheat-sheets" && (
        <div className="text-center py-20 text-white/50">
          Cheat sheets are available in the Resources section as downloadable PDFs.
        </div>
      )}
    </div>
  );
}
