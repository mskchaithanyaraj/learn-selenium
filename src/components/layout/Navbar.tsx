"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { useProgress } from "@/components/providers/ProgressProvider";
import { allTopics } from "@/data/syllabus";
import {
  Menu, Search, Command, Bell, ChevronRight,
  BookOpen, Zap, X
} from "lucide-react";
import clsx from "clsx";

export function Navbar() {
  const { toggle } = useSidebar();
  const { completedCount, totalTopics } = useProgress();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof allTopics>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const progress = Math.round((completedCount / totalTopics) * 100);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(
      allTopics
        .filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        )
        .slice(0, 8)
    );
  }, [query]);

  const handleSelect = (topic: typeof allTopics[0]) => {
    router.push(`/modules/${topic.moduleId}/topics/${topic.id}`);
    setShowSearch(false);
    setQuery("");
  };

  const priorityIcon: Record<string, string> = {
    hot: "🔴",
    warm: "🟡",
    normal: "⚪",
  };

  return (
    <>
      <nav className="glass-nav sticky top-0 z-30 h-14 flex items-center px-4 gap-3">
        {/* Sidebar toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-white/60 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        </button>

        {/* Logo (mobile) */}
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm">SDET Handbook</span>
        </Link>

        {/* Search trigger */}
        <button
          onClick={() => { setShowSearch(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="flex items-center gap-2 flex-1 max-w-sm mx-auto lg:mx-0 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-sm text-white/40 hover:text-white/60 hover:border-white/[0.12] transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search topics…</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] bg-white/[0.07] px-1.5 py-0.5 rounded">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-3">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1.5">
            <div className="w-16 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] text-white/50">{progress}%</span>
          </div>

          {/* Completed badge */}
          <div className="hidden sm:flex items-center gap-1 text-[12px] text-white/40">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{completedCount}/{totalTopics}</span>
          </div>

          {/* Notification bell */}
          <button className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ── Search Palette ─────────────────────────── */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-xl glass-card shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
              <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search topics, modules, concepts…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-white/30 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="text-[10px] bg-white/[0.07] px-1.5 py-0.5 rounded text-white/40">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {results.length === 0 && query && (
                <div className="py-8 text-center text-sm text-white/30">No topics found</div>
              )}
              {results.length === 0 && !query && (
                <div className="p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3">Quick Access</p>
                  <div className="space-y-1">
                    {[
                      { label: "Selenium WebDriver", href: "/modules/selenium-webdriver" },
                      { label: "REST Assured", href: "/modules/rest-assured" },
                      { label: "Interview Prep", href: "/interview" },
                      { label: "Practice Quiz", href: "/practice" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowSearch(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.05] text-sm text-white/60 hover:text-white transition-all"
                      >
                        {item.label}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {results.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelect(topic)}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/[0.05] transition-all text-left group border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-base">{priorityIcon[topic.priority]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white group-hover:text-white font-medium">{topic.title}</p>
                    <p className="text-xs text-white/40 mt-0.5 truncate">{topic.moduleTitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 flex-shrink-0 mt-0.5" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.05] flex items-center gap-4 text-[11px] text-white/25">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
