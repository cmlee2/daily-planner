"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getItem, setItem, subscribe } from "@/lib/storage";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const getSnapshot = () => {
    return JSON.stringify(getItem<T>(key, initialValue));
  };

  const getServerSnapshot = () => {
    return JSON.stringify(initialValue);
  };

  const subscribeToStore = useCallback(
    (callback: () => void) => subscribe(key, callback),
    [key]
  );

  const raw = useSyncExternalStore(subscribeToStore, getSnapshot, getServerSnapshot);
  const value = JSON.parse(raw) as T;

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const current = getItem<T>(key, initialValue);
      const resolved = typeof newValue === "function"
        ? (newValue as (prev: T) => T)(current)
        : newValue;
      setItem(key, resolved);
    },
    [key, initialValue]
  );

  return [value, setValue];
}
