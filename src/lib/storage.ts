import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "ts:favorites";
const HIST_KEY = "ts:history";
export const HISTORY_LIMIT = 20;

export function addToHistory(list: string[], id: string): string[] {
  return [id, ...list.filter((x) => x !== id)].slice(0, HISTORY_LIMIT);
}
export function toggleInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function read(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function useStoredList(key: string) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    setList(read(key));
    const sync = () => setList(read(key));
    window.addEventListener("ts-storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ts-storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);
  const update = useCallback(
    (fn: (l: string[]) => string[]) => {
      const next = fn(read(key));
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event("ts-storage"));
    },
    [key],
  );
  return [list, update] as const;
}

export function useFavorites() {
  const [favs, update] = useStoredList(FAV_KEY);
  return {
    favs,
    isFav: (id: string) => favs.includes(id),
    toggle: (id: string) => update((l) => toggleInList(l, id)),
    clear: () => update(() => []),
  };
}

export function useHistory() {
  const [history, update] = useStoredList(HIST_KEY);
  return {
    history,
    push: (id: string) => update((l) => addToHistory(l, id)),
    clear: () => update(() => []),
  };
}
