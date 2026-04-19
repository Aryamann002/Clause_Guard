"use client";

import Link from "next/link";
import { Shield, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar({ lang, onLangChange }: { lang: any; onLangChange: any }) {
  const [dark, setDark] = useState(false);

  
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full border-b border-stone-100 dark:border-stone-800">
      <Link href="/" className="flex items-center gap-2">
        <Shield className="text-teal-600 w-7 h-7" />
        <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          ClauseGuard
        </span>
      </Link>

      <div className="flex gap-2 items-center">
        {}
        <button
          onClick={() => onLangChange("en")}
          className={
            "text-sm px-2 py-1 rounded-md " +
            (lang === "en"
              ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
              : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800")
          }
        >
          EN
        </button>
        <button
          onClick={() => onLangChange("hi")}
          className={
            "text-sm px-2 py-1 rounded-md " +
            (lang === "hi"
              ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
              : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800")
          }
        >
          HI
        </button>

        {}
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="ml-1 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </nav>
  );
}
