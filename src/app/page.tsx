"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { modules } from "@/data/syllabus";
import { useProgress } from "@/components/providers/ProgressProvider";
import {
  ArrowRight, BookOpen, Zap, Target, Clock, TrendingUp,
  CheckCircle2, Star, Flame, BarChart3, ChevronRight,
  Code2, Cpu, Globe, Smartphone, Activity, Layers
} from "lucide-react";
import clsx from "clsx";

const moduleIcons: Record<string, React.ElementType> = {
  "selenium-webdriver": Globe,
  "rest-assured": Code2,
  "appium": Smartphone,
  "rest-soap-wsdl": Layers,
  "performance-testing": Activity,
  "general-sdet": Cpu,
};

const moduleGradients: Record<string, string> = {
  "selenium-webdriver": "from-blue-500/20 to-cyan-500/10",
  "rest-assured": "from-emerald-500/20 to-teal-500/10",
  "appium": "from-purple-500/20 to-pink-500/10",
  "rest-soap-wsdl": "from-orange-500/20 to-red-500/10",
  "performance-testing": "from-yellow-500/20 to-orange-500/10",
  "general-sdet": "from-slate-500/20 to-gray-500/10",
};

const moduleBorderColors: Record<string, string> = {
  "selenium-webdriver": "border-blue-500/25 hover:border-blue-500/50",
  "rest-assured": "border-emerald-500/25 hover:border-emerald-500/50",
  "appium": "border-purple-500/25 hover:border-purple-500/50",
  "rest-soap-wsdl": "border-orange-500/25 hover:border-orange-500/50",
  "performance-testing": "border-yellow-500/25 hover:border-yellow-500/50",
  "general-sdet": "border-slate-500/25 hover:border-slate-500/50",
};

const moduleIconColors: Record<string, string> = {
  "selenium-webdriver": "text-blue-400",
  "rest-assured": "text-emerald-400",
  "appium": "text-purple-400",
  "rest-soap-wsdl": "text-orange-400",
  "performance-testing": "text-yellow-400",
  "general-sdet": "text-slate-400",
};

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const step = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  color = "blue",
  animate = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  color?: string;
  animate?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    purple: "text-purple-400 bg-purple-500/10",
    red: "text-red-400 bg-red-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10",
  };

  return (
    <div className="glass-card p-5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={clsx("p-2.5 rounded-xl", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1 font-mono">
        {animate ? <AnimatedCounter target={value} /> : value}
        {suffix && <span className="text-lg ml-0.5 text-white/60">{suffix}</span>}
      </div>
      <div className="text-sm text-white/50">{label}</div>
    </div>
  );
}

function ProgressRing({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGrad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="progress-ring-circle"
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HomePage() {
  const { completedCount, totalTopics, progress } = useProgress();
  const overallProgress = Math.round((completedCount / totalTopics) * 100);
  const totalTopicsCount = modules.reduce(
    (acc, m) => acc + m.topicGroups.reduce((a, g) => a + g.topics.length, 0), 0
  );
  const totalHours = modules.reduce((acc, m) => acc + m.estimatedHours, 0);

  return (
    <div className="min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-100" />

        {/* Glow orbs */}
        <div className="hero-orb w-[600px] h-[600px] -top-40 -left-40 bg-blue-600/12" />
        <div className="hero-orb w-[500px] h-[500px] -bottom-20 -right-20 bg-purple-600/10" />
        <div className="hero-orb w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-600/8" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] rounded-full px-4 py-2 text-sm text-white/70 mb-8 animate-[fadeIn_0.6s_ease-out]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Cognizant SDET Interview Preparation Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-[slideUp_0.7s_ease-out]">
            <span className="gradient-text">Master the Complete</span>
            <br />
            <span className="text-white">SDET Handbook</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed animate-[slideUp_0.8s_ease-out]">
            Everything you need to ace your Selenium, REST Assured, Appium, JMeter interview.
            Comprehensive content, interactive quizzes, and progress tracking — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[slideUp_0.9s_ease-out]">
            <Link
              href="/modules/selenium-webdriver"
              className="group flex items-center gap-2 bg-white text-black font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
            >
              <Zap className="w-4 h-4" />
              Start Learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/roadmap"
              className="flex items-center gap-2 bg-white/[0.07] border border-white/[0.12] text-white font-medium px-7 py-3.5 rounded-xl hover:bg-white/[0.1] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              Explore Handbook
            </Link>
          </div>

          {/* Module pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-12 animate-[fadeIn_1.2s_ease-out]">
            {modules.map((m) => (
              <Link
                key={m.id}
                href={`/modules/${m.id}`}
                className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1.5 text-xs text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-all"
              >
                <span>{m.icon}</span>
                {m.title.replace(/^\d+\.\s*/, "")}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-[float_2s_ease-in-out_infinite]">
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
          <div className="w-1 h-1 rounded-full bg-white/30" />
        </div>
      </section>

      {/* ── DASHBOARD ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Dashboard</h2>
            <p className="text-white/40 text-sm mt-1">Track your preparation progress</p>
          </div>
          <Link
            href="/progress"
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            View analytics <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard icon={Layers} label="Total Modules" value={6} color="blue" animate />
          <StatCard icon={BookOpen} label="Total Topics" value={totalTopicsCount} color="cyan" animate />
          <StatCard icon={CheckCircle2} label="Completed" value={completedCount} color="emerald" animate />
          <StatCard icon={Clock} label="Est. Hours" value={totalHours} suffix="h" color="purple" animate />
          <StatCard icon={Flame} label="Study Streak" value={progress.studyStreak} suffix=" days" color="amber" animate />
          <StatCard icon={TrendingUp} label="Progress" value={overallProgress} suffix="%" color="red" animate />
        </div>

        {/* Progress overview */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <ProgressRing progress={overallProgress} size={120} strokeWidth={8} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{overallProgress}%</div>
                  <div className="text-[10px] text-white/40">Complete</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Overall Progress</h3>
              <p className="text-sm text-white/50 mb-4">
                {completedCount} of {totalTopics} topics completed • {totalHours - Math.round(progress.studyMinutes / 60)} hours remaining
              </p>
              <div className="space-y-2">
                {modules.slice(0, 3).map((m) => {
                  const total = m.topicGroups.reduce((a, g) => a + g.topics.length, 0);
                  const done = progress.completedTopics.filter((t) =>
                    m.topicGroups.some((g) => g.topics.some((tp) => tp.id === t))
                  ).length;
                  const pct = Math.round((done / total) * 100);
                  return (
                    <div key={m.id} className="flex items-center gap-3">
                      <span className="text-sm w-40 truncate text-white/60">{m.title.replace(/^\d+\.\s*/, "")}</span>
                      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: "linear-gradient(90deg, #3B82F6, #06B6D4)",
                          }}
                        />
                      </div>
                      <span className="text-xs text-white/40 w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES GRID ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Handbook Modules</h2>
            <p className="text-white/40 text-sm mt-1">Six modules covering the complete SDET syllabus</p>
          </div>
          <Link
            href="/roadmap"
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            View roadmap <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {modules.map((module, i) => {
            const Icon = moduleIcons[module.id] || Globe;
            const totalTopicsInModule = module.topicGroups.reduce(
              (acc, g) => acc + g.topics.length, 0
            );
            const completedInModule = progress.completedTopics.filter((t) =>
              module.topicGroups.some((g) => g.topics.some((tp) => tp.id === t))
            ).length;
            const pct = Math.round((completedInModule / Math.max(totalTopicsInModule, 1)) * 100);

            const difficultyColors: Record<string, string> = {
              easy: "text-emerald-400",
              medium: "text-amber-400",
              hard: "text-red-400",
            };

            const priorityLabels: Record<string, string> = {
              critical: "🔴 Critical",
              important: "🟡 Important",
              "good-to-know": "⚪ Good to Know",
            };

            return (
              <Link
                key={module.id}
                href={`/modules/${module.id}`}
                className={clsx(
                  "group glass-card card-hover p-6 border transition-all duration-300",
                  moduleBorderColors[module.id]
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={clsx(
                      "p-3 rounded-xl bg-gradient-to-br",
                      moduleGradients[module.id]
                    )}
                  >
                    <Icon className={clsx("w-6 h-6", moduleIconColors[module.id])} />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs text-white/50 font-medium">
                      {priorityLabels[module.priority]}
                    </span>
                    <span
                      className={clsx(
                        "text-xs font-medium capitalize",
                        difficultyColors[module.difficulty]
                      )}
                    >
                      {module.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-white transition-colors">
                  {module.title.replace(/^\d+\.\s*/, "")}
                </h3>
                <p className="text-sm text-white/45 mb-5 line-clamp-2">{module.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-white/35 mb-5">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {totalTopicsInModule} topics
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {module.estimatedHours}h
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {completedInModule} done
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-white/30">Progress</span>
                    <span className="text-xs font-medium text-white/60">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background:
                          module.id === "selenium-webdriver"
                            ? "linear-gradient(90deg, #3B82F6, #06B6D4)"
                            : module.id === "rest-assured"
                            ? "linear-gradient(90deg, #10B981, #06B6D4)"
                            : module.id === "appium"
                            ? "linear-gradient(90deg, #8B5CF6, #EC4899)"
                            : module.id === "rest-soap-wsdl"
                            ? "linear-gradient(90deg, #F97316, #EF4444)"
                            : module.id === "performance-testing"
                            ? "linear-gradient(90deg, #EAB308, #F97316)"
                            : "linear-gradient(90deg, #64748B, #6B7280)",
                      }}
                    />
                  </div>
                </div>

                {/* Topics preview */}
                <div className="flex flex-wrap gap-1.5">
                  {module.topicGroups[0]?.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic.id}
                      className={clsx(
                        "text-[11px] px-2 py-0.5 rounded-full border",
                        topic.priority === "hot"
                          ? "bg-red-500/10 border-red-500/20 text-red-300/70"
                          : topic.priority === "warm"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-300/70"
                          : "bg-white/[0.04] border-white/[0.08] text-white/40"
                      )}
                    >
                      {topic.title}
                    </span>
                  ))}
                  {totalTopicsInModule > 3 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/30">
                      +{totalTopicsInModule - 3} more
                    </span>
                  )}
                </div>

                {/* Arrow */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    {module.topicGroups.length} topic groups
                  </span>
                  <div className="flex items-center gap-1 text-sm text-white/30 group-hover:text-white/70 transition-colors">
                    Open module
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── QUICK ACCESS ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { href: "/interview", icon: Target, label: "Interview Prep", color: "blue" },
            { href: "/practice", icon: Zap, label: "Practice Quiz", color: "emerald" },
            { href: "/revision", icon: Star, label: "Quick Revision", color: "amber" },
            { href: "/notes", icon: BookOpen, label: "My Notes", color: "purple" },
            { href: "/progress", icon: BarChart3, label: "Analytics", color: "cyan" },
            { href: "/resources", icon: Layers, label: "Resources", color: "red" },
          ].map(({ href, icon: Icon, label, color }) => {
            const colorMap: Record<string, string> = {
              blue: "from-blue-500/15 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40 text-blue-400",
              emerald: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400",
              amber: "from-amber-500/15 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40 text-amber-400",
              purple: "from-purple-500/15 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40 text-purple-400",
              cyan: "from-cyan-500/15 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400",
              red: "from-red-500/15 to-red-500/5 border-red-500/20 hover:border-red-500/40 text-red-400",
            };

            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br border card-hover transition-all text-center",
                  colorMap[color]
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium text-white/70">{label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
