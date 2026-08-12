"use client";

import { useMemo, useRef, useState, type UIEvent } from "react";
import { WandSparkles } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-typescript";

const prettierLanguages = new Set(["typescript", "javascript", "json", "html", "css"]);
const prismLanguage = (language: string) => language === "html" ? "markup" : language;

function highlightedCode(value: string, language: string) {
  const syntax = prismLanguage(language);
  return Prism.highlight(value, Prism.languages[syntax] ?? Prism.languages.plain, syntax);
}

async function formatCode(code: string, language: string) {
  const prettier = await import("prettier/standalone");
  const estree = (await import("prettier/plugins/estree")).default;
  if (language === "typescript") {
    const typescript = (await import("prettier/plugins/typescript")).default;
    return prettier.format(code, { parser: "typescript", plugins: [typescript, estree] });
  }
  if (language === "javascript" || language === "json") {
    const babel = (await import("prettier/plugins/babel")).default;
    return prettier.format(code, { parser: language === "json" ? "json" : "babel", plugins: [babel, estree] });
  }
  if (language === "html") {
    const html = (await import("prettier/plugins/html")).default;
    return prettier.format(code, { parser: "html", plugins: [html] });
  }
  const postcss = (await import("prettier/plugins/postcss")).default;
  return prettier.format(code, { parser: "css", plugins: [postcss] });
}

export function CodeBlockEditor({ value, language, onChange }: { value: string; language: string; onChange: (value: string) => void }) {
  const highlightRef = useRef<HTMLPreElement>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatError, setFormatError] = useState("");
  const supported = prettierLanguages.has(language);
  const highlighted = useMemo(() => highlightedCode(value, language), [language, value]);

  function syncScroll(event: UIEvent<HTMLTextAreaElement>) {
    if (!highlightRef.current) return;
    highlightRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
  }

  async function handleFormat() {
    if (!value.trim() || !supported) return;
    setIsFormatting(true);
    setFormatError("");
    try {
      onChange((await formatCode(value, language)).trimEnd());
    } catch (error) {
      setFormatError(error instanceof Error ? error.message : "Không thể định dạng đoạn code này.");
    } finally {
      setIsFormatting(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex justify-end">
        <button type="button" onClick={() => void handleFormat()} disabled={!supported || !value.trim() || isFormatting} title={supported ? "Định dạng bằng Prettier" : "Prettier chưa hỗ trợ ngôn ngữ này"} className="inline-flex items-center gap-2 rounded-lg border border-[#475569] bg-[#263246] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#334155] disabled:cursor-not-allowed disabled:opacity-45">
          <WandSparkles className="h-4 w-4" />
          {isFormatting ? "Đang format..." : "Format code"}
        </button>
      </div>
      <div className="relative min-h-48 overflow-hidden rounded-lg border-2 border-[#1E293B] bg-[#111827] focus-within:border-[#A78BFA]">
        <pre ref={highlightRef} aria-hidden="true" className="code-theme pointer-events-none absolute inset-0 overflow-hidden whitespace-pre p-3 font-mono text-sm leading-6 text-slate-100"><code dangerouslySetInnerHTML={{ __html: `${highlighted}\n` }} /></pre>
        <textarea value={value} onChange={(event) => onChange(event.target.value)} onScroll={syncScroll} rows={8} spellCheck={false} placeholder="Dán hoặc viết mã tại đây..." className="relative z-10 block min-h-48 w-full resize-y overflow-auto whitespace-pre bg-transparent p-3 font-mono text-sm leading-6 text-transparent caret-white outline-none selection:bg-violet-400/40" style={{ WebkitTextFillColor: "transparent" }} />
      </div>
      {formatError ? <p className="text-xs font-semibold text-[#BE123C]">Prettier: {formatError}</p> : null}
    </div>
  );
}

export function CodeBlockPreview({ value, language }: { value: string; language: string }) {
  const highlighted = useMemo(() => highlightedCode(value, language), [language, value]);

  return (
    <pre className="code-theme overflow-x-auto p-5 text-sm leading-7 text-slate-100">
      <code className={`language-${prismLanguage(language)}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}
