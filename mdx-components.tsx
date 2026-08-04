import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";

const components = {
  h2: (props) => <h2 className="mt-10 text-2xl font-extrabold tracking-tight text-[#1E293B]" {...props} />,
  h3: (props) => <h3 className="mt-7 text-xl font-extrabold text-[#1E293B]" {...props} />,
  p: (props) => <p className="mt-3 leading-8 text-[#334155]" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-[#334155]" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-[#334155]" {...props} />,
  li: (props) => <li {...props} />,
  a: (props) => <a className="font-bold text-[#8B5CF6] underline decoration-2 underline-offset-2" {...props} />,
  pre: CodeBlock,
  code: (props) => <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[0.9em] text-[#1E293B]" {...props} />,
  Callout,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
