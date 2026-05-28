"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) return <div className="size-9" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="size-9 flex items-center justify-center rounded-md border transition-colors
        border-white/10 text-slate-400 hover:text-white hover:bg-white/8
        dark:border-white/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/8
        light:border-slate-200 light:text-slate-500 light:hover:text-slate-900 light:hover:bg-slate-100"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
