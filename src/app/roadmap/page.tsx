"use client";

import React, { useState } from "react";
import Link from "next/link";
import { modules } from "@/data/syllabus";
import { useProgress } from "@/components/providers/ProgressProvider";
import {
  Clock, BookOpen, CheckCircle2, ChevronRight,
  Lock, Unlock, Star, Zap, Target, ArrowRight
} from "lucide-react";
import clsx from "clsx";

const moduleColors: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  "selenium-webdriver":   { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   dot: "bg-blue-500" },
  "rest-assured":         { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dot: "bg-emerald-500" },
  "appium":               { text: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/30",  dot: "bg-purple-500" },
  "rest-soap-wsdl":       { text: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/30",  dot: "bg-orange-500" },
  "performance-testing":  { text: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/30",  dot: "bg-yellow-500" },
  "general-sdet":         { text: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/30",   dot: "bg-slate-500" },
};

const prerequisites: Record<string, string[]> = {
  "selenium-webdriver": [],
  "rest-assured": [],
  "appium": ["selenium-webdriver"],
  "rest-soap-wsdl": ["rest-assured"],
  "performance-testing": [],
  "general-sdet": [],
};

export default function RoadmapPage() {
  const { progress } = useProgress();
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const getModuleCompletion = (moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId)!;
    const total = mod.topicGroups.reduce((a, g) => a + g.topics.length, 0);
    const done = progress.completedTopics.filter((t) =>
      mod.topicGroups.some((g) => g.topics.some((tp) => tp.id === t))
    ).length;
    return { done, total, pct: Math.round((done / Math.max(total, 1)) * 100) };
  };

  const isUnlocked = (moduleId: string) => {
    const prereqs = prerequisites[moduleId] || [];
    return prereqs.every((prereq) => {
      const { pct } = getModuleCompletion(prereq);
      return pct >= 50; // Unlocked when prereq is 50%+ done
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-white/50 mb-4">
          <Target className="w-3.5 h-3.5" />
          Learning Roadmap
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">SDET Learning Path</h1>
        <p className="text-white/50 text-lg max-w-2xl">
          A structured learning path for mastering all SDET concepts. Follow the sequence for
          optimal learning — prerequisites are marked where applicable.
        </p>
      </div>

      {/* Overall progress */}
      <div className="glass-card p-6 mb-12 flex flex-wrap gap-6">
        {[
          { label: "Modules", value: modules.length, color: "text-blue-400" },
          { label: "Topics", value: modules.reduce((a, m) => a + m.topicGroups.reduce((b, g) => b + g.topics.length, 0), 0), color: "text-emerald-400" },
          { label: "Total Hours", value: modules.reduce((a, m) => a + m.estimatedHours, 0) + "h", color: "text-amber-400" },
          { label: "Completed", value: progress.completedTopics.length, color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 min-w-[100px]">
            <div className={clsx("text-3xl font-bold mb-1", stat.color)}>{stat.value}</div>
            <div className="text-sm text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="timeline-line" />

        <div className="space-y-8 pl-12">
          {modules.map((module, idx) => {
            const { done, total, pct } = getModuleCompletion(module.id);
            const colors = moduleColors[module.id];
            const unlocked = isUnlocked(module.id);
            const prereqs = prerequisites[module.id];
            const isActive = activeModule === module.id;
            const isCompleted = pct === 100;

            return (
              <div key={module.id} className="relative">
                {/* Timeline dot */}
                <div
                  className={clsx(
                    "absolute -left-12 top-5 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all",
                    isCompleted
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : !unlocked
                      ? "bg-white/[0.04] border-white/[0.15] text-white/30"
                      : `${colors.bg} ${colors.border} ${colors.text}`
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : !unlocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Card */}
                <div
                  className={clsx(
                    "glass-card p-6 border cursor-pointer transition-all duration-300",
                    isActive ? `${colors.border} shadow-lg` : "border-white/[0.08] hover:border-white/[0.15]",
                    !unlocked && "opacity-70"
                  )}
                  onClick={() => setActiveModule(isActive ? null : module.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{module.icon}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                          {/* Difficulty badge */}
                          <span className={clsx(
                            "text-xs px-2 py-0.5 rounded-full border capitalize",
                            module.difficulty === "hard"
                              ? "text-red-400 bg-red-500/10 border-red-500/20"
                              : module.difficulty === "medium"
                              ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                              : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          )}>
                            {module.difficulty}
                          </span>
                          {module.priority === "critical" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                              🔴 Critical
                            </span>
                          )}
                          {!unlocked && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/40 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/50 mb-4 leading-relaxed">{module.description}</p>

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-5 text-sm text-white/35">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            {total} topics
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            ~{module.estimatedHours}h estimated
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {done}/{total} done
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                              className={clsx("h-full rounded-full transition-all duration-700 bg-gradient-to-r", {
                                "from-blue-500 to-cyan-400": module.id === "selenium-webdriver",
                                "from-emerald-500 to-teal-400": module.id === "rest-assured",
                                "from-purple-500 to-pink-400": module.id === "appium",
                                "from-orange-500 to-red-400": module.id === "rest-soap-wsdl",
                                "from-yellow-500 to-orange-400": module.id === "performance-testing",
                                "from-slate-500 to-gray-400": module.id === "general-sdet",
                              })}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/40 w-10 text-right">{pct}%</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={clsx(
                        "w-5 h-5 text-white/25 flex-shrink-0 mt-1 transition-transform",
                        isActive && "rotate-90"
                      )}
                    />
                  </div>

                  {/* Expanded details */}
                  {isActive && (
                    <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-4">
                      {/* Prerequisites */}
                      {prereqs.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
                            Prerequisites
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {prereqs.map((prereqId) => {
                              const prereqMod = modules.find((m) => m.id === prereqId);
                              const { pct: prereqPct } = getModuleCompletion(prereqId);
                              return (
                                <Link
                                  key={prereqId}
                                  href={`/modules/${prereqId}`}
                                  className={clsx(
                                    "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all",
                                    prereqPct >= 50
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                      : "bg-white/[0.04] border-white/[0.1] text-white/45"
                                  )}
                                >
                                  {prereqPct >= 50 ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                  {prereqMod?.title.replace(/^\d+\.\s*/, "")}
                                  <span className="opacity-60">({prereqPct}%)</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Topic groups */}
                      <div>
                        <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
                          Topic Groups
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {module.topicGroups.map((group) => (
                            <div
                              key={group.title}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]"
                            >
                              <span className="text-sm text-white/60">{group.title}</span>
                              <span className="text-xs text-white/35">{group.topics.length} topics</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex gap-3">
                        <Link
                          href={`/modules/${module.id}`}
                          className="flex items-center gap-2 bg-white text-black font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all"
                        >
                          Start Module <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/interview?module=${module.id}`}
                          className="flex items-center gap-2 bg-white/[0.07] border border-white/[0.1] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-white/[0.1] transition-all"
                        >
                          <Target className="w-4 h-4" />
                          Interview Prep
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-5 mt-10">
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">Legend</p>
        <div className="flex flex-wrap gap-6">
          {[
            { icon: <div className="w-4 h-4 rounded-full bg-white/20 border border-white/20" />, label: "Not started" },
            { icon: <div className="w-4 h-4 rounded-full bg-blue-500/40 border border-blue-500" />, label: "In progress" },
            { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, label: "Completed" },
            { icon: <Lock className="w-4 h-4 text-white/30" />, label: "Locked (complete prerequisites)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-white/45">
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
