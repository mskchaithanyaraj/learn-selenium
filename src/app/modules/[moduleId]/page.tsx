"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { modules } from "@/data/syllabus";
import { getModuleTopics } from "@/data/moduleContent";
import { useProgress } from "@/components/providers/ProgressProvider";
import {
  BookOpen, Clock, CheckCircle2, ChevronRight, Target,
  Zap, ArrowLeft, Code2, ListChecks, Lightbulb
} from "lucide-react";
import clsx from "clsx";

const moduleGradients: Record<string, string> = {
  "selenium-webdriver": "from-blue-600 to-cyan-600",
  "rest-assured": "from-emerald-600 to-teal-600",
  "appium": "from-purple-600 to-pink-600",
  "rest-soap-wsdl": "from-orange-600 to-red-600",
  "performance-testing": "from-yellow-500 to-orange-600",
  "general-sdet": "from-slate-600 to-gray-600",
};

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const resolvedParams = React.use(params);
  const module = modules.find((m) => m.id === resolvedParams.moduleId);
  if (!module) notFound();

  const { progress } = useProgress();
  const topicContents = getModuleTopics(resolvedParams.moduleId);
  const totalTopics = module.topicGroups.reduce((acc, g) => acc + g.topics.length, 0);
  const completedTopics = progress.completedTopics.filter((t) =>
    module.topicGroups.some((g) => g.topics.some((tp) => tp.id === t))
  ).length;
  const pct = Math.round((completedTopics / Math.max(totalTopics, 1)) * 100);

  const difficultyColors: Record<string, string> = {
    easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    hard: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white/70">{module.title.replace(/^\d+\.\s*/, "")}</span>
      </div>

      {/* ── Module Header ───────────────────────────────────── */}
      <div className={clsx(
        "glass-card p-8 mb-8 bg-gradient-to-br border-white/10",
        `from-white/[0.02] to-transparent relative overflow-hidden`
      )}>
        {/* Gradient orb */}
        <div
          className={clsx(
            "absolute -top-20 -right-20 w-60 h-60 rounded-full filter blur-3xl opacity-20 bg-gradient-to-br",
            moduleGradients[module.id]
          )}
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-3xl">{module.icon}</span>
            <div
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium border",
                module.priority === "critical"
                  ? "bg-red-500/15 text-red-300 border-red-500/30"
                  : module.priority === "important"
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "bg-white/[0.07] text-white/50 border-white/[0.1]"
              )}
            >
              {module.priority === "critical" ? "🔴 Very Important" : module.priority === "important" ? "🟡 Important" : "⚪ Good to Know"}
            </div>
            <div className={clsx("px-3 py-1 rounded-full text-xs font-medium border capitalize", difficultyColors[module.difficulty])}>
              {module.difficulty}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">{module.title}</h1>
          <p className="text-white/55 text-lg mb-6 max-w-2xl">{module.description}</p>

          <div className="flex flex-wrap gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {totalTopics} topics
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ~{module.estimatedHours} hours
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {completedTopics}/{totalTopics} completed
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2 text-white/40">
              <span>Module Progress</span>
              <span className="font-medium text-white/70">{pct}%</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={clsx("h-full rounded-full transition-all duration-700 bg-gradient-to-r", moduleGradients[module.id])}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Topic Groups ────────────────────────────────────── */}
      <div className="space-y-6">
        {module.topicGroups.map((group, gi) => (
          <div key={group.title} className="glass-card p-6">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-5 h-px bg-white/20" />
              {group.title}
              <span className="text-white/25 font-normal normal-case tracking-normal">
                ({group.topics.length} topics)
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.topics.map((topic) => {
                const isDone = progress.completedTopics.includes(topic.id);
                const hasContent = topicContents.some((tc) => tc.id === topic.id);

                return (
                  <Link
                    key={topic.id}
                    href={`/modules/${module.id}/topics/${topic.id}`}
                    className={clsx(
                      "flex items-start gap-3 p-4 rounded-xl border card-hover transition-all group",
                      isDone
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-white/[0.07] hover:border-white/[0.15] bg-white/[0.02]"
                    )}
                  >
                    {/* Priority indicator */}
                    <div className="mt-0.5 flex-shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span
                          className={clsx(
                            "block w-3 h-3 rounded-full mt-0.5",
                            topic.priority === "hot"
                              ? "bg-red-500"
                              : topic.priority === "warm"
                              ? "bg-amber-500"
                              : "bg-white/25"
                          )}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={clsx(
                            "text-sm font-medium transition-colors",
                            isDone
                              ? "text-white/50 line-through"
                              : "text-white/85 group-hover:text-white"
                          )}
                        >
                          {topic.title}
                        </h3>
                        {topic.priority === "hot" && (
                          <span className="badge-hot text-[10px] px-1.5 py-0.5">Must Know</span>
                        )}
                      </div>
                      <p className="text-xs text-white/35 line-clamp-2">{topic.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-white/25">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {topic.estimatedMinutes}min
                        </span>
                        {hasContent && (
                          <span className="flex items-center gap-1 text-blue-400/60">
                            <BookOpen className="w-3 h-3" />
                            Full content
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 flex-shrink-0 mt-1 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Links ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Link
          href="/interview"
          className="glass-card p-5 card-hover flex items-center gap-3 border border-white/[0.07] hover:border-white/[0.15]"
        >
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Interview Prep</div>
            <div className="text-xs text-white/40">Practice questions</div>
          </div>
        </Link>
        <Link
          href="/practice"
          className="glass-card p-5 card-hover flex items-center gap-3 border border-white/[0.07] hover:border-white/[0.15]"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Quick Quiz</div>
            <div className="text-xs text-white/40">Test your knowledge</div>
          </div>
        </Link>
        <Link
          href="/revision"
          className="glass-card p-5 card-hover flex items-center gap-3 border border-white/[0.07] hover:border-white/[0.15]"
        >
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Revision Mode</div>
            <div className="text-xs text-white/40">Cheat sheets & summaries</div>
          </div>
        </Link>
      </div>

    </div>
  );
}
