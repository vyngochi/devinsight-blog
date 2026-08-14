import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { Figure } from "@/components/mdx/figure";
import { ImageGrid } from "@/components/mdx/image-grid";

export const contentMdxComponents = {
  h2: (props) => <h2 className="mt-10 scroll-mt-24 text-2xl font-extrabold tracking-tight text-[#1E293B]" {...props} />,
  h3: (props) => <h3 className="mt-7 scroll-mt-24 text-xl font-extrabold text-[#1E293B]" {...props} />,
  p: (props) => <p className="mt-3 leading-8 text-[#334155]" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-[#334155]" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-[#334155]" {...props} />,
  li: (props) => <li className="pl-1 marker:font-bold marker:text-[#8B5CF6]" {...props} />,
  a: (props) => <a className="font-bold text-[#8B5CF6] underline decoration-2 underline-offset-2" {...props} />,
  blockquote: (props) => <blockquote className="my-6 border-l-4 border-[#8B5CF6] pl-5 text-lg font-semibold italic leading-8 text-[#475569]" {...props} />,
  hr: (props) => <hr className="my-10 border-0 border-t-2 border-[#CBD5E1]" {...props} />,
  pre: CodeBlock,
  code: (props) => <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[0.9em] text-[#1E293B]" {...props} />,
  Callout,
  Figure,
  ImageGrid,
} satisfies MDXComponents;
