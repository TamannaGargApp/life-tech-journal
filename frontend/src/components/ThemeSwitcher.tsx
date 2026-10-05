"use client";
import { useEffect, useState } from "react";

export type ThemePref = "light" | "dark" | "system";
const STORAGE_KEY = "theme";

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}

export function applyTheme(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}


const OPTIONS: { value: ThemePref; icon: string; label: string }[] = [
  { value: "light",  icon: "☀️", label: "Light" },
  { value: "dark",   icon: "🌙", label: "Dark" },
  { value: "system", icon: "💻", label: "System" },
];

export default function ThemeSwitcher() {
  const [pref, setPref] = useState<ThemePref>("system");

  useEffect(() => { setPref(readPref()); }, []);

  // Follow the operating system while "System" is selected
  useEffect(() => {
    applyTheme(pref);
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const choose = (p: ThemePref) => {
    setPref(p);
    try { localStorage.setItem(STORAGE_KEY, p); } catch {}
  };

  return (
    <div role="radiogroup" aria-label="Color theme"
      style={{ display: "flex", gap: 2, padding: 3, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--card)" }}>
      {OPTIONS.map(o => {
        const active = pref === o.value;
        return (
          <button key={o.value} role="radio" aria-checked={active} title={`${o.label} theme`} onClick={() => choose(o.value)}
            style={{ width: 30, height: 26, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center",
              background: active ? "var(--primary-light)" : "transparent", boxShadow: active ? "inset 0 0 0 1px var(--primary-border)" : "none", transition: "background 0.15s" }}>
            <span aria-hidden>{o.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
