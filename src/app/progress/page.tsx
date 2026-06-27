"use client";

import React, { useEffect, useState } from "react";
import { useProgress } from "@/components/providers/ProgressProvider";
import { modules } from "@/data/syllabus";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { 
  Trophy, TrendingUp, Clock, BookOpen, Star, 
  Target, Download, Lock, CheckCircle2 
} from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const achievements = [
  { id: "first-topic", title: "First Step", desc: "Complete your first topic", req: 1, icon: Target },
  { id: "five-streak", title: "Consistency", desc: "Study for 5 days in a row", req: 5, type: "streak", icon: Star },
  { id: "half-way", title: "Halfway There", desc: "Complete 50% of all topics", req: 42, icon: TrendingUp },
  { id: "module-master", title: "Module Master", desc: "Complete an entire module", req: 1, type: "module", icon: Trophy },
];

// Mock activity data for 7 days
const activityData = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 60 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 90 },
  { day: "Fri", minutes: 40 },
  { day: "Sat", minutes: 120 },
  { day: "Sun", minutes: 20 },
];

export default function ProgressPage() {
  const { completedCount, totalTopics, progress } = useProgress();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const pct = Math.round((completedCount / totalTopics) * 100);
  const totalHours = Math.round(progress.studyMinutes / 60);

  const handleExport = () => {
    const data = JSON.stringify(progress, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sdet-progress.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress exported!");
  };

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Analytics</h1>
          <p className="text-white/50 text-sm">Track your learning journey and performance.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-lg text-sm text-white transition-all"
        >
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 border-blue-500/20 bg-blue-500/5">
          <BookOpen className="w-5 h-5 text-blue-400 mb-3" />
          <div className="text-2xl font-bold text-white">{completedCount}</div>
          <div className="text-xs text-white/50">Topics Completed</div>
        </div>
        <div className="glass-card p-5 border-emerald-500/20 bg-emerald-500/5">
          <Clock className="w-5 h-5 text-emerald-400 mb-3" />
          <div className="text-2xl font-bold text-white">{totalHours}h</div>
          <div className="text-xs text-white/50">Total Time Studied</div>
        </div>
        <div className="glass-card p-5 border-amber-500/20 bg-amber-500/5">
          <Star className="w-5 h-5 text-amber-400 mb-3" />
          <div className="text-2xl font-bold text-white">{progress.studyStreak}</div>
          <div className="text-xs text-white/50">Day Streak</div>
        </div>
        <div className="glass-card p-5 border-purple-500/20 bg-purple-500/5">
          <Trophy className="w-5 h-5 text-purple-400 mb-3" />
          <div className="text-2xl font-bold text-white">{pct}%</div>
          <div className="text-xs text-white/50">Overall Progress</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Module Breakdown */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">Module Breakdown</h2>
          <div className="space-y-5">
            {modules.map((m) => {
              const mTotal = m.topicGroups.reduce((a, g) => a + g.topics.length, 0);
              const mDone = progress.completedTopics.filter(t => 
                m.topicGroups.some(g => g.topics.some(tp => tp.id === t))
              ).length;
              const mPct = Math.round((mDone / mTotal) * 100);

              return (
                <div key={m.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80">{m.title.replace(/^\d+\.\s*/, "")}</span>
                    <span className="text-white/40">{mDone}/{mTotal} ({mPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${mPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">Study Activity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#17171B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === activityData.length - 1 ? '#3B82F6' : 'rgba(59,130,246,0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            let unlocked = false;
            if (ach.type === 'streak') unlocked = progress.studyStreak >= ach.req;
            else if (ach.type === 'module') unlocked = progress.completedModules.length >= ach.req;
            else unlocked = completedCount >= ach.req;

            return (
              <div 
                key={ach.id} 
                className={clsx(
                  "p-4 rounded-xl border text-center transition-all",
                  unlocked 
                    ? "bg-amber-500/10 border-amber-500/30" 
                    : "bg-white/[0.02] border-white/[0.05] opacity-50 grayscale"
                )}
              >
                <div className="mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-black/20">
                  {unlocked ? <ach.icon className="w-5 h-5 text-amber-400" /> : <Lock className="w-5 h-5 text-white/30" />}
                </div>
                <div className="text-sm font-bold text-white mb-1">{ach.title}</div>
                <div className="text-[10px] text-white/50">{ach.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
