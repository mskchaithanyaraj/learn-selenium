"use client";

import React, { useState } from "react";
import { useProgress } from "@/components/providers/ProgressProvider";
import { allTopics } from "@/data/syllabus";
import { FileText, Search, Save, Download, Trash2, Edit3, X } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function NotesPage() {
  const { progress, saveNote } = useProgress();
  const [search, setSearch] = useState("");
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");

  const topicsWithNotes = Object.keys(progress.notes).filter(id => progress.notes[id].trim().length > 0);
  
  const displayTopics = allTopics.filter(t => {
    const hasNote = topicsWithNotes.includes(t.id);
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (hasNote || search.length > 2);
  }).sort((a, b) => {
    // Sort topics with notes first
    const aHasNote = topicsWithNotes.includes(a.id);
    const bHasNote = topicsWithNotes.includes(b.id);
    if (aHasNote && !bHasNote) return -1;
    if (!aHasNote && bHasNote) return 1;
    return 0;
  });

  const selectTopic = (id: string) => {
    setActiveTopicId(id);
    setNoteContent(progress.notes[id] || "");
  };

  const handleSave = () => {
    if (activeTopicId) {
      saveNote(activeTopicId, noteContent);
      toast.success("Note saved!");
    }
  };

  const handleExport = () => {
    if (!activeTopicId) return;
    const topic = allTopics.find(t => t.id === activeTopicId);
    const blob = new Blob([`# ${topic?.title}\n\n${noteContent}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTopicId}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to Markdown");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear this note?")) {
      setNoteContent("");
      if (activeTopicId) saveNote(activeTopicId, "");
      toast.success("Note cleared");
    }
  };

  const activeTopic = allTopics.find(t => t.id === activeTopicId);

  return (
    <div className="h-[calc(100vh-56px)] flex">
      {/* Sidebar List */}
      <div className="w-80 border-r border-white/[0.05] bg-[#0B0B0D] flex flex-col">
        <div className="p-4 border-b border-white/[0.05]">
          <h2 className="text-lg font-semibold text-white mb-3">My Notes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9 w-full text-sm py-2"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {displayTopics.map((topic) => {
            const hasNote = topicsWithNotes.includes(topic.id);
            const isActive = activeTopicId === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic.id)}
                className={clsx(
                  "w-full text-left p-3 rounded-lg transition-all",
                  isActive 
                    ? "bg-blue-500/15 border border-blue-500/30" 
                    : "hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {hasNote ? <FileText className="w-3.5 h-3.5 text-blue-400" /> : <Edit3 className="w-3.5 h-3.5 text-white/30" />}
                  <span className={clsx("text-xs font-medium truncate", isActive ? "text-blue-300" : "text-white/80")}>
                    {topic.title}
                  </span>
                </div>
                <div className="text-[10px] text-white/40 truncate pl-5">
                  {topic.moduleTitle.replace(/^\d+\.\s*/, "")}
                </div>
              </button>
            );
          })}
          {displayTopics.length === 0 && (
            <div className="text-center py-10 text-white/30 text-sm">
              No topics found.
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-[#111114]">
        {activeTopic ? (
          <>
            {/* Toolbar */}
            <div className="h-14 border-b border-white/[0.05] flex items-center justify-between px-6 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white/40" />
                <span className="text-sm font-medium text-white">{activeTopic.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSave} className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-3 py-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] transition-all">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={handleExport} className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-3 py-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] transition-all">
                  <Download className="w-3.5 h-3.5" /> Export .md
                </button>
                <button onClick={handleClear} className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-all">
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
                <button onClick={() => setActiveTopicId(null)} className="p-1.5 text-white/40 hover:text-white rounded ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your notes here... (Markdown supported when exported)"
              className="flex-1 w-full bg-transparent text-white/80 p-8 outline-none resize-none font-mono text-sm leading-relaxed"
            />
            
            {/* Status bar */}
            <div className="h-8 border-t border-white/[0.05] flex items-center px-6 text-[10px] text-white/30 bg-[#0B0B0D]">
              {noteContent.length} chars • {noteContent.split(/\s+/).filter(Boolean).length} words
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
              <Edit3 className="w-6 h-6 text-white/20" />
            </div>
            <h2 className="text-xl font-medium text-white/70 mb-2">Select a topic to take notes</h2>
            <p className="text-sm text-white/40 max-w-sm">
              Your notes are auto-saved in your browser. You can export them as Markdown files at any time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
