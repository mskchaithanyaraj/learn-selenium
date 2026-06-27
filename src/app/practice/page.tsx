"use client";

import React, { useState, useEffect } from "react";
import { interviewQuestions } from "@/data/interviewQuestions";
import { modules } from "@/data/syllabus";
import { Zap, Play, CheckCircle2, XCircle, RotateCcw, Target, Layers } from "lucide-react";
import clsx from "clsx";

export default function PracticePage() {
  const [activeModule, setActiveModule] = useState("all");
  const [mode, setMode] = useState<"setup" | "quiz" | "flashcards">("setup");
  const [questions, setQuestions] = useState<typeof interviewQuestions>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  // Flashcard state
  const [isFlipped, setIsFlipped] = useState(false);

  const startQuiz = () => {
    const qList = interviewQuestions
      .filter((q) => (activeModule === "all" || q.moduleId === activeModule) && q.level === "mcq")
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // Take 10 random MCQs
    setQuestions(qList);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOpt(null);
    setMode("quiz");
  };

  const startFlashcards = () => {
    const qList = interviewQuestions
      .filter((q) => (activeModule === "all" || q.moduleId === activeModule) && q.level !== "mcq")
      .sort(() => Math.random() - 0.5);
    setQuestions(qList);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMode("flashcards");
  };

  const handleAnswer = (idx: number) => {
    if (selectedOpt !== null) return; // already answered
    setSelectedOpt(idx);
    const correct = idx === questions[currentIndex].correctOption;
    if (correct) setScore((s) => s + 1);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
        setSelectedOpt(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (mode === "setup") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full px-4 py-1.5 text-sm mb-4">
            <Zap className="w-3.5 h-3.5" />
            Practice Arena
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Test Your Knowledge</h1>
          <p className="text-white/50 text-lg">Choose a module and a mode to start practicing.</p>
        </div>

        <div className="glass-card p-6 max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">1. Select Module</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setActiveModule("all")}
              className={clsx(
                "p-3 rounded-xl border text-sm transition-all text-left",
                activeModule === "all" ? "bg-white/[0.1] border-white/20 text-white" : "border-white/[0.05] bg-white/[0.02] text-white/50 hover:border-white/[0.1]"
              )}
            >
              All Modules
            </button>
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={clsx(
                  "p-3 rounded-xl border text-sm transition-all text-left truncate",
                  activeModule === m.id ? "bg-white/[0.1] border-white/20 text-white" : "border-white/[0.05] bg-white/[0.02] text-white/50 hover:border-white/[0.1]"
                )}
              >
                {m.title.replace(/^\d+\.\s*/, "")}
              </button>
            ))}
          </div>

          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">2. Select Mode</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={startQuiz} className="glass-card p-5 text-left border border-white/[0.05] hover:border-emerald-500/30 group transition-all">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">MCQ Quiz</h3>
              <p className="text-xs text-white/40">10 random multiple choice questions.</p>
            </button>
            <button onClick={startFlashcards} className="glass-card p-5 text-left border border-white/[0.05] hover:border-purple-500/30 group transition-all">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Flashcards</h3>
              <p className="text-xs text-white/40">Flip through concepts for quick revision.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "quiz") {
    if (questions.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-white/50 mb-4">Not enough MCQ questions for this module.</p>
          <button onClick={() => setMode("setup")} className="text-blue-400">Go Back</button>
        </div>
      );
    }
    
    if (showResult) {
      const pct = Math.round((score / questions.length) * 100);
      return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-white/50 text-lg mb-8">You scored {score} out of {questions.length} ({pct}%)</p>
          <button
            onClick={() => setMode("setup")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90"
          >
            <RotateCcw className="w-4 h-4" /> Try Another
          </button>
        </div>
      );
    }

    const q = questions[currentIndex];
    
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between text-sm text-white/40 mb-8">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        
        {/* Progress */}
        <div className="w-full h-1 bg-white/[0.05] rounded-full mb-10 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300" 
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>

        <div className="glass-card p-8 border-white/[0.08]">
          <h2 className="text-xl sm:text-2xl font-medium text-white mb-8 leading-relaxed">
            {q.question}
          </h2>
          <div className="space-y-3">
            {q.options?.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === q.correctOption;
              const showStatus = selectedOpt !== null;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={clsx(
                    "quiz-option w-full flex items-center justify-between",
                    isSelected && "selected",
                    showStatus && isCorrect && "correct",
                    showStatus && isSelected && !isCorrect && "wrong"
                  )}
                  disabled={showStatus}
                >
                  <span className="text-base">{opt}</span>
                  {showStatus && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                  {showStatus && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "flashcards") {
    if (questions.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-white/50 mb-4">Not enough questions for this module.</p>
          <button onClick={() => setMode("setup")} className="text-blue-400">Go Back</button>
        </div>
      );
    }

    const q = questions[currentIndex];

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between text-sm text-white/40 mb-6">
          <button onClick={() => setMode("setup")} className="hover:text-white transition-colors">Exit</button>
          <span>Card {currentIndex + 1} of {questions.length}</span>
        </div>

        <div className="flashcard-container h-[400px] w-full cursor-pointer mb-8" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={clsx("flashcard w-full h-full duration-500 relative", isFlipped && "flipped")}>
            {/* Front */}
            <div className="flashcard-front absolute w-full h-full glass-card border border-white/[0.08] p-8 flex flex-col items-center justify-center text-center bg-white/[0.02]">
              <span className="text-xs text-white/30 uppercase tracking-widest mb-4">Question</span>
              <h2 className="text-2xl font-medium text-white">{q.question}</h2>
              <span className="absolute bottom-6 text-xs text-white/20">Click to flip</span>
            </div>
            {/* Back */}
            <div className="flashcard-back absolute w-full h-full glass-card border border-emerald-500/30 p-8 flex flex-col items-center justify-center text-center bg-emerald-500/5">
              <span className="text-xs text-emerald-400/50 uppercase tracking-widest mb-4">Answer</span>
              <p className="text-base text-white/80 leading-relaxed overflow-y-auto line-clamp-6">{q.answer}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={() => { if(currentIndex > 0) { setCurrentIndex(i=>i-1); setIsFlipped(false); } }}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 rounded-lg bg-white/[0.05] text-white/50 hover:bg-white/[0.1] hover:text-white disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <button 
            onClick={() => { if(currentIndex < questions.length - 1) { setCurrentIndex(i=>i+1); setIsFlipped(false); } }}
            disabled={currentIndex === questions.length - 1}
            className="px-5 py-2.5 rounded-lg bg-white/[0.1] text-white hover:bg-white/[0.15] disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return null;
}
