"use client";

import { isValidElement, useMemo, useState, type ReactNode } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import { Check, Copy } from "lucide-react";

const languageNames: Record<string, string> = {
  bash: "Bash",
  css: "CSS",
  html: "HTML",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  text: "Text",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
};

function extractCode(children: ReactNode) {
  if (isValidElement<{ children?: ReactNode; className?: string }>(children)) {
    const matchedLanguage = children.props.className?.match(/language-([\w-]+)/)?.[1];
    return { code: String(children.props.children ?? "").trimEnd(), language: matchedLanguage };
  }

  return { code: String(children ?? "").trimEnd(), language: undefined };
}

export function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const { code, language: providedLanguage } = extractCode(children);
  const language = providedLanguage ?? (code.includes("git ") ? "bash" : "text");
  const languageDefinition = Prism.languages[language] ?? Prism.languages.plain;
  const highlightedCode = useMemo(() => Prism.highlight(code, languageDefinition, language), [code, language, languageDefinition]);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="my-7 overflow-hidden rounded-xl border-2 border-[#1E293B] bg-[#111827] shadow-pop-sm">
      <div className="flex items-center justify-between border-b border-slate-600 bg-[#263246] px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-300">{languageNames[language] ?? language}</span>
        </div>
        <button type="button" onClick={copyCode} className="inline-flex items-center gap-1.5 rounded-md border border-slate-500 bg-slate-700 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]" aria-label="Sao chép code">
          {copied ? <Check className="h-3.5 w-3.5 text-[#34D399]" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Đã chép" : "Sao chép"}
        </button>
      </div>
      <pre className="code-theme overflow-x-auto p-5 text-sm leading-7 text-slate-100"><code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: highlightedCode }} /></pre>
    </div>
  );
}
