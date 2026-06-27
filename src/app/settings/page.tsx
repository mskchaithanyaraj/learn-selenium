"use client";

import React, { useState } from "react";
import {
  Settings, Sun, Moon, Type, ZoomIn, ZoomOut,
  Focus, Bell, BellOff, Download, Trash2,
  RefreshCw, Eye, Keyboard, Accessibility, Check
} from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useProgress } from "@/components/providers/ProgressProvider";

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={clsx(
        "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none",
        enabled ? "bg-blue-500" : "bg-white/[0.1]"
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
          enabled && "translate-x-5"
        )}
      />
    </button>
  );
}

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/[0.05]">
          <Icon className="w-4 h-4 text-white/50" />
        </div>
        <div>
          <div className="text-sm font-medium text-white/85">{label}</div>
          {description && <div className="text-xs text-white/35 mt-0.5">{description}</div>}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6 mb-4">
      <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { progress } = useProgress();
  const [settings, setSettings] = useState({
    focusMode: false,
    notifications: true,
    fontSize: "medium" as "small" | "medium" | "large",
    codeFont: true,
    reducedMotion: false,
    highContrast: false,
    readingMode: false,
    autoSave: true,
    keyboardShortcuts: true,
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const update = (key: keyof typeof settings, value: unknown) => {
    setSettings((s) => ({ ...s, [key]: value }));
    toast.success("Setting updated");
  };

  const exportProgress = () => {
    const data = JSON.stringify(progress, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sdet-progress-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress exported!");
  };

  const resetProgress = () => {
    localStorage.removeItem("sdet-progress");
    toast.success("Progress reset. Reload to apply.");
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/[0.06]">
            <Settings className="w-5 h-5 text-white/60" />
          </div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-white/40 text-sm">Customize your learning experience</p>
      </div>

      {/* ── Appearance ──────────────────────────── */}
      <SectionCard title="Appearance">
        <SettingRow icon={Sun} label="Theme" description="Currently using dark theme">
          <div className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.1] rounded-lg p-1">
            {["Dark", "System"].map((t) => (
              <button
                key={t}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  t === "Dark"
                    ? "bg-white/[0.1] text-white"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow icon={Type} label="Font Size" description="Adjust reading text size">
          <div className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.1] rounded-lg p-1">
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                key={size}
                onClick={() => update("fontSize", size)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                  settings.fontSize === size
                    ? "bg-white/[0.1] text-white"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow icon={Eye} label="Reading Mode" description="Simplified layout for focused reading">
          <ToggleSwitch enabled={settings.readingMode} onChange={(v) => update("readingMode", v)} />
        </SettingRow>

        <SettingRow icon={Focus} label="Focus Mode" description="Hide sidebar and distractions">
          <ToggleSwitch enabled={settings.focusMode} onChange={(v) => update("focusMode", v)} />
        </SettingRow>
      </SectionCard>

      {/* ── Notifications ───────────────────────── */}
      <SectionCard title="Notifications">
        <SettingRow icon={Bell} label="Study Reminders" description="Get reminded to study daily">
          <ToggleSwitch enabled={settings.notifications} onChange={(v) => update("notifications", v)} />
        </SettingRow>
        <SettingRow icon={RefreshCw} label="Auto-save Notes" description="Automatically save your notes">
          <ToggleSwitch enabled={settings.autoSave} onChange={(v) => update("autoSave", v)} />
        </SettingRow>
      </SectionCard>

      {/* ── Accessibility ────────────────────────── */}
      <SectionCard title="Accessibility">
        <SettingRow icon={Accessibility} label="High Contrast" description="Increase text and element contrast">
          <ToggleSwitch enabled={settings.highContrast} onChange={(v) => update("highContrast", v)} />
        </SettingRow>
        <SettingRow icon={ZoomIn} label="Reduced Motion" description="Minimize animations for motion sensitivity">
          <ToggleSwitch enabled={settings.reducedMotion} onChange={(v) => update("reducedMotion", v)} />
        </SettingRow>
        <SettingRow icon={Keyboard} label="Keyboard Shortcuts" description="Enable ⌘K search and other shortcuts">
          <ToggleSwitch enabled={settings.keyboardShortcuts} onChange={(v) => update("keyboardShortcuts", v)} />
        </SettingRow>
      </SectionCard>

      {/* ── Keyboard Shortcuts Reference ────────── */}
      <SectionCard title="Keyboard Shortcuts">
        <div className="space-y-2">
          {[
            { key: "⌘K", action: "Open search palette" },
            { key: "⌘B", action: "Toggle sidebar" },
            { key: "⌘/", action: "Toggle focus mode" },
            { key: "→", action: "Next topic" },
            { key: "←", action: "Previous topic" },
            { key: "M", action: "Mark topic complete" },
            { key: "ESC", action: "Close modals/search" },
          ].map(({ key, action }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm text-white/55">{action}</span>
              <kbd className="flex items-center gap-1 bg-white/[0.07] border border-white/[0.1] rounded-lg px-2.5 py-1 text-xs text-white/60 font-mono">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Data & Backup ──────────────────────── */}
      <SectionCard title="Data & Backup">
        <SettingRow icon={Download} label="Export Progress" description="Download your progress as JSON">
          <button
            onClick={exportProgress}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-sm text-white/70 hover:text-white hover:bg-white/[0.1] transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </SettingRow>

        <SettingRow icon={Trash2} label="Reset Progress" description="Clear all progress and start fresh">
          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={resetProgress}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-white/50 text-xs hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/15 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
          )}
        </SettingRow>
      </SectionCard>

      {/* About */}
      <div className="glass-card p-5 text-center">
        <p className="text-xs text-white/25 leading-relaxed">
          SDET Handbook v1.0 • Built for Cognizant SDET Interview Preparation
          <br />
          Covering Selenium, REST Assured, Appium, JMeter, REST/SOAP/WSDL
        </p>
      </div>
    </div>
  );
}
