"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
// Colors every markdown token in a backdrop that sits exactly under a transparent-text textarea.
// Only classes are changed (never font weight/size), so glyph widths and wrapping stay identical.
const INLINE = /(`[^`\n]+`)|(!?\[[^\]\n]*\]\([^)\n]*\))|(\*\*[^*\n]+\*\*|__[^_\n]+__)|(\*[^*\s][^*\n]*\*|_[^_\s][^_\n]*_)|(~~[^~\n]+~~)|(\[[^\]\n]*\](?!\())/g;
const INLINE_CLASS = ["", "md-code", "md-link", "md-bold", "md-italic", "md-strike", "md-bracket"];
function inline(text: string, base?: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0, n = 0;
  for (const m of text.matchAll(INLINE)) {
    const i = m.index ?? 0;
    if (i > last) out.push(<span key={n++} className={base}>{text.slice(last, i)}</span>);
    out.push(<span key={n++} className={INLINE_CLASS[m.slice(1).findIndex(Boolean) + 1]}>{m[0]}</span>);
    last = i + m[0].length;
  }
  if (last < text.length) out.push(<span key={n++} className={base}>{text.slice(last)}</span>);
  return out;
}
function line(raw: string, inFence: boolean): { node: ReactNode; fence: boolean } {
  if (/^\s*(```|~~~)/.test(raw)) return { node: <span className="md-fence">{raw}</span>, fence: !inFence };
  if (inFence) return { node: <span className="md-codeblock">{raw}</span>, fence: true };
  let m = raw.match(/^(\s{0,3})(#{1,6})(\s+)(.*)$/);
  if (m) return { node: <>{m[1]}<span className="md-mark">{m[2]}{m[3]}</span>{inline(m[4], `md-h md-h${m[2].length}`)}</>, fence: false };
  if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(raw)) return { node: <span className="md-hr">{raw}</span>, fence: false };
  m = raw.match(/^(\s*)([-*+])(\s+)(\[[ xX]\])(\s.*|)$/);
  if (m) return { node: <>{m[1]}<span className="md-mark">{m[2]}</span>{m[3]}<span className={/[xX]/.test(m[4]) ? "md-check md-done" : "md-check"}>{m[4]}</span>{inline(m[5])}</>, fence: false };
  m = raw.match(/^(\s*)([-*+]|\d+[.)])(\s+)(.*)$/);
  if (m) return { node: <>{m[1]}<span className="md-mark">{m[2]}</span>{m[3]}{inline(m[4])}</>, fence: false };
  m = raw.match(/^(\s*>+\s?)(.*)$/);
  if (m) return { node: <><span className="md-mark md-quote-mark">{m[1]}</span>{inline(m[2], "md-quote")}</>, fence: false };
  if (/^\s*\|.*\|\s*$/.test(raw)) {
    return { node: <>{raw.split(/(\|)/).map((part, i) => part === "|" ? <span key={i} className="md-mark">|</span> : <span key={i} className={/^\s*:?-{2,}:?\s*$/.test(part) ? "md-hr" : undefined}>{part}</span>)}</>, fence: false };
  }
  return { node: <>{inline(raw)}</>, fence: false };
}
function highlight(value: string): ReactNode[] {
  let fence = false;
  return value.split(/\r?\n/).map((raw, i) => {
    const r = line(raw, fence);
    fence = r.fence;
    return <div key={i} className="md-line">{r.node}{raw === "" ? "\u200b" : null}</div>;
  });
}
export function MarkdownInput({ name, defaultValue, required }: { name: string; defaultValue: string; required?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const area = useRef<HTMLTextAreaElement>(null);
  const back = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ta = area.current, form = ta?.form;
    if (!ta || !form) return;
    // React resets uncontrolled fields after a form action; re-sync the highlight afterwards.
    const sync = () => setTimeout(() => setValue(ta.value), 0);
    form.addEventListener("reset", sync);
    return () => form.removeEventListener("reset", sync);
  }, []);
  function scroll() {
    if (back.current && area.current) { back.current.scrollTop = area.current.scrollTop; back.current.scrollLeft = area.current.scrollLeft; }
  }
  return <div className="md-editor">
    <div className="md-backdrop" ref={back} aria-hidden="true">{highlight(value)}</div>
    <textarea ref={area} className="markdown-input md-textarea" name={name} defaultValue={defaultValue} required={required} spellCheck={false} onInput={e => setValue(e.currentTarget.value)} onScroll={scroll}/>
  </div>;
}
