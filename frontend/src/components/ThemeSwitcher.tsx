"use client";
import { useEffect, useState, type ReactNode } from "react";

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


const svg = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>
);
const OPTIONS: { value: ThemePref; icon: ReactNode; label: string }[] = [
  { value: "light",  label: "Light",  icon: svg(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>) },
  { value: "dark",   label: "Dark",   icon: svg(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />) },
  { value: "system", label: "System", icon: svg(<><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>) },
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
    <div role="radiogroup" aria-label="Color theme" className="theme-seg">
      {OPTIONS.map(o => (
        <button key={o.value} role="radio" aria-checked={pref === o.value} aria-label={`${o.label} theme`} title={`${o.label} theme`} onClick={() => choose(o.value)}>
          {o.icon}
        </button>
      ))}
    </div>
  );
}
