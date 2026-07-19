"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getTheme(): Theme {
  return readStoredTheme() ?? systemTheme();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (readStoredTheme() === null) {
      applyTheme(systemTheme());
      onStoreChange();
    }
  };
  mq.addEventListener("change", onSystemChange);

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onStoreChange);
    mq.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): Theme {
  return "light";
}

function setThemePreference(next: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  applyTheme(next);
  emit();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerSnapshot);

  const choose = useCallback((next: Theme) => {
    setThemePreference(next);
  }, []);

  return (
    <div className="theme-stamp" role="group" aria-label="Color theme">
      <button
        type="button"
        className="theme-stamp__opt"
        aria-pressed={theme === "light"}
        onClick={() => choose("light")}
      >
        Day
      </button>
      <button
        type="button"
        className="theme-stamp__opt"
        aria-pressed={theme === "dark"}
        onClick={() => choose("dark")}
      >
        Night
      </button>
    </div>
  );
}
