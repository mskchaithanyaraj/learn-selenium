"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { modules } from "@/data/syllabus";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import {
  BookOpen, ChevronDown, Search, Bookmark, Clock, Star,
  Home, Map, FlaskConical, FileText, Brain, BarChart3,
  Download, Settings, Zap, X, Target
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/interview", label: "Interview Prep", icon: Target },
  { href: "/practice", label: "Practice Mode", icon: FlaskConical },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/revision", label: "Quick Revision", icon: Brain },
  { href: "/progress", label: "Analytics", icon: BarChart3 },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

const priorityColors: Record<string, string> = {
  critical: "text-red-400",
  important: "text-amber-400",
  "good-to-know": "text-gray-400",
};

const priorityDot: Record<string, string> = {
  critical: "bg-red-500",
  important: "bg-amber-500",
  "good-to-know": "bg-gray-500",
};

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const { completedCount, totalTopics, progress } = useProgress();
  const [search, setSearch] = useState("");
  const [expandedModules, setExpandedModules] = useState<string[]>(["selenium-webdriver"]);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const filteredModules = search
    ? modules.map((m) => ({
        ...m,
        topicGroups: m.topicGroups.map((g) => ({
          ...g,
          topics: g.topics.filter((t) =>
            t.title.toLowerCase().includes(search.toLowerCase())
          ),
        })).filter((g) => g.topics.length > 0),
      })).filter((m) => m.topicGroups.length > 0)
    : modules;

  const overallProgress = Math.round((completedCount / totalTopics) * 100);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 bg-[#111114] border-r border-white/[0.08] overflow-y-auto transition-all duration-300 ease-in-out no-scrollbar",
          "lg:static lg:flex-shrink-0 lg:h-screen",
          !isOpen ? "-translate-x-full w-[280px] lg:translate-x-0 lg:w-0 lg:border-r-0 lg:opacity-0" : "translate-x-0 w-[280px] lg:opacity-100"
        )}
      >
        {/* ── Header ─────────────────────────────────── */}
        <div className="p-4 border-b border-white/[0.07] sticky top-0 bg-[#111114] z-10">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-white">SDET Handbook</span>
            </Link>
            <button
              onClick={close}
              className="lg:hidden p-1.5 rounded-md hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] text-white/40">Overall Progress</span>
              <span className="text-[11px] text-white/60 font-medium">{overallProgress}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Search topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-8 py-2 text-xs"
            />
          </div>
        </div>

        {/* ── Main Nav ──────────────────────────────── */}
        <div className="p-3">
          <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-2 px-2">
            Navigation
          </p>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => { if (window.innerWidth < 1024) close(); }}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5",
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "bg-white/[0.08] text-white font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Modules ───────────────────────────────── */}
        <div className="p-3 pt-1">
          <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-2 px-2">
            Modules
          </p>

          {filteredModules.map((module) => {
            const isExpanded = expandedModules.includes(module.id) || !!search;
            const moduleTopicCount = module.topicGroups.reduce(
              (acc, g) => acc + g.topics.length, 0
            );
            const completedInModule = progress.completedTopics.filter((t) =>
              module.topicGroups.some((g) => g.topics.some((tp) => tp.id === t))
            ).length;
            const pct = Math.round((completedInModule / Math.max(moduleTopicCount, 1)) * 100);

            return (
              <div key={module.id} className="mb-1">
                {/* Module header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className={clsx(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group",
                    pathname.startsWith(`/modules/${module.id}`)
                      ? "bg-white/[0.07]"
                      : "hover:bg-white/[0.04]"
                  )}
                >
                  <span className="text-base flex-shrink-0">{module.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={clsx("text-xs font-medium truncate", priorityColors[module.priority])}>
                        {module.title.replace(/^\d+\.\s*/, "")}
                      </span>
                      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", priorityDot[module.priority])} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/30 flex-shrink-0">{pct}%</span>
                    </div>
                  </div>
                  <ChevronDown
                    className={clsx(
                      "w-3.5 h-3.5 text-white/30 transition-transform flex-shrink-0",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Topics */}
                {isExpanded && (
                  <div className="ml-3 pl-3 border-l border-white/[0.06] mt-1 mb-2 space-y-0.5">
                    {module.topicGroups.map((group) => (
                      <div key={group.title}>
                        <p className="text-[9px] font-medium text-white/25 uppercase tracking-widest px-2 py-1">
                          {group.title}
                        </p>
                        {group.topics.map((topic) => {
                          const isActive = pathname === `/modules/${module.id}/topics/${topic.id}`;
                          const isDone = progress.completedTopics.includes(topic.id);
                          return (
                            <Link
                              key={topic.id}
                              href={`/modules/${module.id}/topics/${topic.id}`}
                              onClick={() => { if (window.innerWidth < 1024) close(); }}
                              className={clsx(
                                "flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] transition-all duration-150",
                                isActive
                                  ? "bg-blue-500/15 text-blue-300"
                                  : isDone
                                  ? "text-white/40 hover:text-white/70"
                                  : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                              )}
                            >
                              <span
                                className={clsx(
                                  "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                  topic.priority === "hot"
                                    ? "bg-red-500/70"
                                    : topic.priority === "warm"
                                    ? "bg-amber-500/70"
                                    : "bg-white/20",
                                  isDone && "bg-emerald-500/80"
                                )}
                              />
                              <span className={clsx("truncate", isDone && "line-through opacity-50")}>
                                {topic.title}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    ))}

                    <Link
                      href={`/modules/${module.id}`}
                      onClick={() => { if (window.innerWidth < 1024) close(); }}
                      className="flex items-center gap-2 px-2 py-2 rounded-md text-[11px] text-blue-400/70 hover:text-blue-300 hover:bg-blue-500/[0.06] transition-all mt-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      View full module →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Bookmarks ──────────────────────────────── */}
        {progress.bookmarks.length > 0 && (
          <div className="p-3 border-t border-white/[0.05]">
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-2 px-2 flex items-center gap-1.5">
              <Bookmark className="w-3 h-3" /> Bookmarks
            </p>
            {progress.bookmarks.slice(0, 5).map((topicId) => (
              <div
                key={topicId}
                className="px-2 py-1.5 rounded-md text-[12px] text-white/50 hover:text-white/80 cursor-pointer hover:bg-white/[0.04] transition-all"
              >
                {topicId.replace(/-/g, " ")}
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ────────────────────────────────── */}
        <div className="p-4 border-t border-white/[0.05] mt-auto">
          <div className="flex items-center gap-3 text-[11px] text-white/30">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.round(progress.studyMinutes / 60)}h studied
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {progress.studyStreak} day streak
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
