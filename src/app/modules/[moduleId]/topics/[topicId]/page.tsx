"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { modules, allTopics } from "@/data/syllabus";
import { getTopicContent } from "@/data/moduleContent";
import { useProgress } from "@/components/providers/ProgressProvider";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ChevronRight, CheckCircle2, Bookmark, BookmarkCheck,
  Copy, Check, Clock, Star, ArrowLeft, ArrowRight,
  Lightbulb, AlertTriangle, Code2, MessageSquare,
  ListChecks, Zap, RefreshCw, Eye
} from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

function CodeBlock({ code, language = "java" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block my-4 relative">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[11px] text-white/30 font-mono">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded-md hover:bg-white/[0.06]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: "20px",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
          showLineNumbers
          lineNumberStyle={{ color: "rgba(255,255,255,0.15)", minWidth: "2.5em" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, color = "blue" }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    red: "text-red-400 bg-red-500/10",
    purple: "text-purple-400 bg-purple-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10",
  };
  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className={clsx("p-2 rounded-lg", colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function TopicPage({
  params,
}: {
  params: Promise<{ moduleId: string; topicId: string }>;
}) {
  const resolvedParams = React.use(params);
  const module = modules.find((m) => m.id === resolvedParams.moduleId);
  if (!module) notFound();

  // Find topic in module
  const topicMeta = module.topicGroups
    .flatMap((g) => g.topics)
    .find((t) => t.id === resolvedParams.topicId);

  const content = getTopicContent(resolvedParams.topicId);

  const { isTopicComplete, markTopicComplete, isBookmarked, toggleBookmark, addStudyMinutes } =
    useProgress();

  const isDone = isTopicComplete(resolvedParams.topicId);
  const bookmarked = isBookmarked(resolvedParams.topicId);

  const [note, setNote] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Track time spent
  useEffect(() => {
    const start = Date.now();
    return () => {
      const minutes = Math.round((Date.now() - start) / 60000);
      if (minutes > 0) addStudyMinutes(minutes);
    };
  }, []);

  // Find adjacent topics
  const allModuleTopics = module.topicGroups.flatMap((g) => g.topics);
  const currentIdx = allModuleTopics.findIndex((t) => t.id === resolvedParams.topicId);
  const prevTopic = currentIdx > 0 ? allModuleTopics[currentIdx - 1] : null;
  const nextTopic = currentIdx < allModuleTopics.length - 1 ? allModuleTopics[currentIdx + 1] : null;

  const handleComplete = () => {
    markTopicComplete(resolvedParams.topicId);
    if (!isDone) setShowConfetti(true);
    toast.success(isDone ? "Marked as incomplete" : "Topic completed! 🎉");
  };

  const handleBookmark = () => {
    toggleBookmark(resolvedParams.topicId);
    toast.success(bookmarked ? "Bookmark removed" : "Bookmarked! 📌");
  };

  const displayTitle = content?.title || topicMeta?.title || resolvedParams.topicId.replace(/-/g, " ");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/modules/${module.id}`} className="hover:text-white transition-colors">
          {module.title.replace(/^\d+\.\s*/, "")}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white/70">{displayTitle}</span>
      </div>

      {/* ── Topic Header ─────────────────────────────────────── */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {topicMeta?.priority === "hot" && (
                <span className="badge-hot">🔴 Must Know</span>
              )}
              {topicMeta?.priority === "warm" && (
                <span className="badge-warm">🟡 Important</span>
              )}
              {topicMeta?.priority === "normal" && (
                <span className="badge-normal">⚪ Good to Know</span>
              )}
              <span className="flex items-center gap-1 text-xs text-white/30">
                <Clock className="w-3 h-3" />
                {topicMeta?.estimatedMinutes || content?.estimatedMinutes || 30} min
              </span>
              {isDone && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{displayTitle}</h1>
            {content && (
              <p className="text-white/55 leading-relaxed">{content.overview}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={handleBookmark}
              className={clsx(
                "p-2.5 rounded-xl border transition-all",
                bookmarked
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  : "bg-white/[0.05] border-white/[0.1] text-white/40 hover:text-white/70"
              )}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {content ? (
        <>
          {/* ── Why It Matters ───────────────────────────────────── */}
          <div className="glass-card p-5 mb-6 border border-blue-500/15 bg-blue-500/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 flex-shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-300 mb-1">Why This Matters</h3>
                <p className="text-sm text-white/65 leading-relaxed">{content.whyItMatters}</p>
              </div>
            </div>
          </div>

          {/* ── Explanation ──────────────────────────────────────── */}
          <Section icon={BookmarkCheck} title="Deep Explanation" color="blue">
            <div className="content-prose">
              {content.explanation.split("\n\n").map((para, i) => {
                if (para.startsWith("**") && para.includes(":**")) {
                  const parts = para.split("\n");
                  return (
                    <div key={i} className="mb-4">
                      {parts.map((line, li) => {
                        if (line.startsWith("**") && line.includes(":**")) {
                          const bold = line.replace(/\*\*(.*?)\*\*/g, "$1");
                          return <h3 key={li}>{bold}</h3>;
                        }
                        if (line.startsWith("- ")) {
                          return (
                            <ul key={li}><li>{line.substring(2).replace(/\*\*(.*?)\*\*/g, "$1")}</li></ul>
                          );
                        }
                        if (line.startsWith("| ")) {
                          return null; // Tables handled separately
                        }
                        if (line.trim()) return <p key={li}>{line.replace(/\*\*(.*?)\*\*/g, "$1").replace(/`(.*?)`/g, "$1")}</p>;
                        return null;
                      })}
                    </div>
                  );
                }
                if (para.startsWith("| ")) {
                  const rows = para.split("\n").filter((r) => r.startsWith("|"));
                  return (
                    <div key={i} className="overflow-x-auto mb-4">
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          {rows.map((row, ri) => {
                            if (row.includes("---")) return null;
                            const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                            const Tag = ri === 0 ? "th" : "td";
                            return (
                              <tr key={ri} className={ri === 0 ? "border-b border-white/10" : "border-b border-white/[0.04]"}>
                                {cells.map((cell, ci) => (
                                  <Tag
                                    key={ci}
                                    className={clsx(
                                      "px-3 py-2 text-left",
                                      ri === 0 ? "text-white/60 text-xs font-semibold uppercase tracking-wider" : "text-white/65 text-sm"
                                    )}
                                  >
                                    {cell.replace(/\*\*(.*?)\*\*/g, "$1").replace(/`(.*?)`/g, "$1")}
                                  </Tag>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return (
                  <p key={i} className="mb-4">
                    {para.replace(/\*\*(.*?)\*\*/g, "$1").replace(/`(.*?)`/g, "$1")}
                  </p>
                );
              })}
            </div>
          </Section>

          {/* ── Key Points ─────────────────────────────────────── */}
          <Section icon={ListChecks} title="Key Points" color="emerald">
            <div className="grid gap-2">
              {content.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/75 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Code Example ──────────────────────────────────── */}
          {content.codeExample && (
            <Section icon={Code2} title="Code Example" color="cyan">
              <CodeBlock code={content.codeExample} language={content.codeLanguage || "java"} />
            </Section>
          )}

          {/* ── Real-World Example ────────────────────────────── */}
          <Section icon={Eye} title="Real-World Example" color="purple">
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
              <p className="text-sm text-white/70 leading-relaxed">{content.realWorldExample}</p>
            </div>
          </Section>

          {/* ── Common Mistakes ───────────────────────────────── */}
          <Section icon={AlertTriangle} title="Common Mistakes" color="red">
            <div className="space-y-2">
              {content.commonMistakes.map((mistake, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">✕</span>
                  <span className="text-sm text-white/65 leading-relaxed">{mistake}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Best Practices ────────────────────────────────── */}
          <Section icon={Star} title="Best Practices" color="amber">
            <div className="space-y-2">
              {content.bestPractices.map((practice, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <span className="text-amber-400 flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm text-white/65 leading-relaxed">{practice}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Interview Q&A ─────────────────────────────────── */}
          <Section icon={MessageSquare} title="Interview Questions" color="blue">
            <div className="space-y-4">
              {content.interviewQuestions.map((qa, i) => (
                <InterviewQA key={i} question={qa.q} answer={qa.a} index={i} />
              ))}
            </div>
          </Section>

          {/* ── Revision Summary ──────────────────────────────── */}
          <div className="glass-card p-6 mb-6 border border-emerald-500/20 bg-emerald-500/[0.03]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-white">Quick Revision</h2>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-mono bg-black/20 p-4 rounded-xl border border-white/[0.05]">
              {content.revisionSummary}
            </p>
          </div>

          {/* ── Tags ─────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-6">
            {content.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/45">
                #{tag}
              </span>
            ))}
          </div>
        </>
      ) : (
        /* No content placeholder */
        <div className="glass-card p-12 text-center mb-6">
          <BookmarkCheck className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white/60 mb-2">Content Available</h3>
          <p className="text-white/35 text-sm max-w-sm mx-auto">
            {topicMeta?.description || "Detailed content for this topic is being prepared."}
          </p>
        </div>
      )}

      {/* ── Completion Button ─────────────────────────────────── */}
      <div className="glass-card p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            {isDone ? "✅ Topic Completed" : "Ready to mark as complete?"}
          </h3>
          <p className="text-sm text-white/40 mt-1">
            {isDone
              ? "Great work! Move on to the next topic."
              : "Mark this topic as done when you're confident."}
          </p>
        </div>
        <button
          onClick={handleComplete}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.97]",
            isDone
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-white text-black hover:bg-white/90"
          )}
        >
          {isDone ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Mark Incomplete
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Mark Complete
            </>
          )}
        </button>
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {prevTopic ? (
          <Link
            href={`/modules/${module.id}/topics/${prevTopic.id}`}
            className="glass-card p-4 card-hover border border-white/[0.07] hover:border-white/[0.15] flex items-center gap-3 group"
          >
            <ArrowLeft className="w-5 h-5 text-white/30 group-hover:text-white/60 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-white/30 mb-1">Previous</div>
              <div className="text-sm font-medium text-white/70 group-hover:text-white truncate">
                {prevTopic.title}
              </div>
            </div>
          </Link>
        ) : <div />}

        {nextTopic ? (
          <Link
            href={`/modules/${module.id}/topics/${nextTopic.id}`}
            className="glass-card p-4 card-hover border border-white/[0.07] hover:border-white/[0.15] flex items-center justify-end gap-3 text-right group"
          >
            <div className="min-w-0">
              <div className="text-xs text-white/30 mb-1">Next</div>
              <div className="text-sm font-medium text-white/70 group-hover:text-white truncate">
                {nextTopic.title}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/60 flex-shrink-0" />
          </Link>
        ) : (
          <Link
            href={`/modules/${module.id}`}
            className="glass-card p-4 card-hover border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-end gap-3 text-right group bg-emerald-500/5"
          >
            <div>
              <div className="text-xs text-emerald-400/60 mb-1">Module Complete</div>
              <div className="text-sm font-medium text-emerald-300 group-hover:text-emerald-200">
                Back to {module.title.replace(/^\d+\.\s*/, "")}
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
}

function InterviewQA({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.07] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/15 text-blue-400 text-xs flex items-center justify-center font-bold mt-0.5">
          Q
        </span>
        <span className="flex-1 text-sm font-medium text-white/85">{question}</span>
        <ChevronRight
          className={clsx("w-4 h-4 text-white/30 flex-shrink-0 mt-0.5 transition-transform", open && "rotate-90")}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-white/[0.05]">
          <div className="flex items-start gap-3 pt-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs flex items-center justify-center font-bold mt-0.5">
              A
            </span>
            <p className="text-sm text-white/65 leading-relaxed">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
