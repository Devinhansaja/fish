import type { ReactNode } from "react";

/**
 * Gives a heading its signature look: the last word or two are drawn in a gradient.
 * Only plain-text headings are touched; anything else is rendered unchanged.
 */
export function Hl({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  const words = children.trim().split(/\s+/);
  if (words.length < 2) return <>{children}</>;
  const n = Math.min(2, Math.max(1, Math.floor(words.length / 2)));
  const head = words.slice(0, words.length - n).join(" ");
  const tail = words.slice(words.length - n).join(" ");
  return (
    <>
      {head} <span className="hl">{tail}</span>
    </>
  );
}
