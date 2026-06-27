"use client";

import React, { useState } from "react";
import { 
  Book, PlayCircle, GitBranch, FileText, Code2, 
  ExternalLink, Search, Bookmark, Monitor, Layers
} from "lucide-react";
import clsx from "clsx";

const RESOURCES = [
  // Documentation
  { id: "docs-1", type: "docs", module: "selenium-webdriver", title: "Selenium Official Docs", desc: "The definitive guide to Selenium WebDriver.", url: "https://www.selenium.dev/documentation/", tags: ["Official", "WebDriver"] },
  { id: "docs-2", type: "docs", module: "selenium-webdriver", title: "TestNG Documentation", desc: "Official TestNG documentation for annotations and listeners.", url: "https://testng.org/doc/documentation-main.html", tags: ["TestNG", "Java"] },
  { id: "docs-3", type: "docs", module: "rest-assured", title: "REST Assured Usage Guide", desc: "Comprehensive guide for REST API testing in Java.", url: "https://github.com/rest-assured/rest-assured/wiki/Usage", tags: ["API", "REST Assured"] },
  { id: "docs-4", type: "docs", module: "appium", title: "Appium Documentation", desc: "Official guide for mobile automation using Appium.", url: "https://appium.io/docs/en/latest/", tags: ["Mobile", "Appium"] },
  { id: "docs-5", type: "docs", module: "performance-testing", title: "Apache JMeter User Manual", desc: "The official manual for building JMeter test plans.", url: "https://jmeter.apache.org/usermanual/index.html", tags: ["JMeter", "Performance"] },

  // Practice Websites
  { id: "prac-1", type: "practice", module: "general-sdet", title: "HackerRank (Java/Python)", desc: "Practice coding problems for SDET interviews.", url: "https://www.hackerrank.com/", tags: ["Coding", "Algorithms"] },
  { id: "prac-2", type: "practice", module: "rest-assured", title: "Restful Booker API", desc: "A playground API to practice REST Assured testing.", url: "https://restful-booker.herokuapp.com/", tags: ["API", "Practice"] },
  { id: "prac-3", type: "practice", module: "selenium-webdriver", title: "The Internet Herokuapp", desc: "Practice handling tricky UI elements (dropdowns, alerts, iframes).", url: "https://the-internet.herokuapp.com/", tags: ["UI", "Selenium"] },
  
  // GitHub Repos
  { id: "git-1", type: "github", module: "selenium-webdriver", title: "SeleniumHQ / selenium", desc: "The official Selenium GitHub repository.", url: "https://github.com/SeleniumHQ/selenium", tags: ["Source Code", "Selenium"] },
  { id: "git-2", type: "github", module: "rest-assured", title: "rest-assured / rest-assured", desc: "The official REST Assured GitHub repository.", url: "https://github.com/rest-assured/rest-assured", tags: ["Source Code", "API"] },
  
  // Books
  { id: "book-1", type: "books", module: "general-sdet", title: "Clean Code", desc: "A Handbook of Agile Software Craftsmanship by Robert C. Martin.", url: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882", tags: ["Must Read", "Coding"] },
  { id: "book-2", type: "books", module: "general-sdet", title: "Agile Testing", desc: "A Practical Guide for Testers and Agile Teams by Lisa Crispin.", url: "https://www.amazon.com/Agile-Testing-Practical-Guide-Testers/dp/0321534468", tags: ["Testing", "Agile"] },
];

const TABS = [
  { id: "all", label: "All Resources", icon: Layers },
  { id: "docs", label: "Documentation", icon: Book },
  { id: "practice", label: "Practice Sites", icon: Monitor },
  { id: "github", label: "GitHub Repos", icon: GitBranch },
  { id: "books", label: "Books", icon: Bookmark },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter((r) => {
    const matchTab = activeTab === "all" || r.type === activeTab;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                        r.desc.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Resource Library</h1>
        <p className="text-white/50 text-sm">Curated tools, documentation, and practice sites to accelerate your learning.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white/[0.1] text-white shadow-sm"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-9 w-full"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((resource) => {
          let Icon = FileText;
          let color = "blue";
          if (resource.type === "docs") { Icon = Book; color = "blue"; }
          if (resource.type === "practice") { Icon = Monitor; color = "emerald"; }
          if (resource.type === "github") { Icon = GitBranch; color = "purple"; }
          if (resource.type === "books") { Icon = Bookmark; color = "amber"; }

          const colorClasses = {
            blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
            emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
            amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          }[color];

          return (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 card-hover group flex flex-col h-full border border-white/[0.07] hover:border-white/[0.2]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={clsx("p-2.5 rounded-lg border", colorClasses)}>
                  <Icon className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{resource.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">{resource.desc}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {resource.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/40">
          No resources match your search criteria.
        </div>
      )}
    </div>
  );
}
