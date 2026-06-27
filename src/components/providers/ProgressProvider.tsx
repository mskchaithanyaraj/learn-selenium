"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Progress {
  completedTopics: string[];
  completedModules: string[];
  bookmarks: string[];
  studyStreak: number;
  lastStudyDate: string;
  studyMinutes: number;
  notes: Record<string, string>;
}

interface ProgressContextType {
  progress: Progress;
  markTopicComplete: (topicId: string) => void;
  toggleBookmark: (topicId: string) => void;
  isTopicComplete: (topicId: string) => boolean;
  isBookmarked: (topicId: string) => boolean;
  getModuleProgress: (moduleId: string, totalTopics: number) => number;
  addStudyMinutes: (minutes: number) => void;
  saveNote: (topicId: string, note: string) => void;
  getNote: (topicId: string) => string;
  totalTopics: number;
  completedCount: number;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const defaultProgress: Progress = {
  completedTopics: [],
  completedModules: [],
  bookmarks: [],
  studyStreak: 0,
  lastStudyDate: "",
  studyMinutes: 0,
  notes: {},
};

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const TOTAL_TOPICS = 84;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sdet-progress");
      if (stored) setProgress(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (p: Progress) => {
    setProgress(p);
    try { localStorage.setItem("sdet-progress", JSON.stringify(p)); } catch {}
  };

  const markTopicComplete = (topicId: string) => {
    const updated = {
      ...progress,
      completedTopics: progress.completedTopics.includes(topicId)
        ? progress.completedTopics.filter((t) => t !== topicId)
        : [...progress.completedTopics, topicId],
      lastStudyDate: new Date().toISOString().split("T")[0],
    };
    save(updated);
  };

  const toggleBookmark = (topicId: string) => {
    const updated = {
      ...progress,
      bookmarks: progress.bookmarks.includes(topicId)
        ? progress.bookmarks.filter((b) => b !== topicId)
        : [...progress.bookmarks, topicId],
    };
    save(updated);
  };

  const isTopicComplete = (topicId: string) => progress.completedTopics.includes(topicId);
  const isBookmarked = (topicId: string) => progress.bookmarks.includes(topicId);

  const getModuleProgress = (moduleId: string, totalTopics: number) => {
    const completed = progress.completedTopics.filter((t) => t.startsWith(moduleId) || true).length;
    return Math.round((completed / Math.max(totalTopics, 1)) * 100);
  };

  const addStudyMinutes = (minutes: number) => {
    save({ ...progress, studyMinutes: progress.studyMinutes + minutes });
  };

  const saveNote = (topicId: string, note: string) => {
    save({ ...progress, notes: { ...progress.notes, [topicId]: note } });
  };

  const getNote = (topicId: string) => progress.notes[topicId] || "";

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markTopicComplete,
        toggleBookmark,
        isTopicComplete,
        isBookmarked,
        getModuleProgress,
        addStudyMinutes,
        saveNote,
        getNote,
        totalTopics: TOTAL_TOPICS,
        completedCount: progress.completedTopics.length,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
