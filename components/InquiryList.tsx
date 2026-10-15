"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * "Quote list": lets buyers collect several species WITH quantities and send ONE
 * consolidated quotation request. Stored in localStorage (no personal data).
 */
export type QuoteItem = { slug: string; qty: number };

export const MAX_QTY = 1_000_000;
/** Pre-filled suggestion only; buyers type their own quantity. */
export const DEFAULT_QTY = 10;
export const clampQty = (n: number) => (Number.isFinite(n) ? Math.min(MAX_QTY, Math.max(1, Math.round(n))) : 1);

const KEY = "aqz-quote-items";
const OLD_KEY = "aqz-quote-list"; // v1 stored species slugs only
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: QuoteItem[] } = { raw: null, value: [] };
const EMPTY: QuoteItem[] = [];

function read(): QuoteItem[] {
  try {
    let raw = window.localStorage.getItem(KEY);
    if (raw === null) {
      // one-time migration from v1 (slugs only, quantity unknown -> 1)
      const old = window.localStorage.getItem(OLD_KEY);
      if (old) {
        const parsed = JSON.parse(old) as unknown;
        if (Array.isArray(parsed)) {
          const migrated = parsed.filter((x): x is string => typeof x === "string").map((slug) => ({ slug, qty: 1 }));
          window.localStorage.setItem(KEY, JSON.stringify(migrated));
          window.localStorage.removeItem(OLD_KEY);
          raw = JSON.stringify(migrated);
        }
      }
    }
    if (raw === cache.raw) return cache.value;
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    const value: QuoteItem[] = Array.isArray(parsed)
      ? parsed
          .filter((x): x is QuoteItem => !!x && typeof (x as QuoteItem).slug === "string")
          .map((x) => ({ slug: x.slug, qty: clampQty(Number(x.qty)) }))
      : [];
    cache = { raw, value };
    return value;
  } catch {
    return EMPTY;
  }
}
function write(v: QuoteItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function useQuoteList() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const list = useMemo(() => items.map((i) => i.slug), [items]);

  /** Add a species or update its quantity if it is already in the list. */
  const setItem = useCallback((slug: string, qty: number) => {
    const q = clampQty(qty);
    const cur = read();
    write(cur.some((i) => i.slug === slug) ? cur.map((i) => (i.slug === slug ? { ...i, qty: q } : i)) : [...cur, { slug, qty: q }]);
  }, []);
  const add = useCallback((slug: string, qty = 1) => {
    const cur = read();
    if (!cur.some((i) => i.slug === slug)) write([...cur, { slug, qty: clampQty(qty) }]);
  }, []);
  const remove = useCallback((slug: string) => write(read().filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => write([]), []);

  return useMemo(
    () => ({
      items,
      list,
      setItem,
      add,
      remove,
      clear,
      has: (s: string) => list.includes(s),
      qtyOf: (s: string) => items.find((i) => i.slug === s)?.qty ?? 0,
    }),
    [items, list, setItem, add, remove, clear],
  );
}
