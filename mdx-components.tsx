import type { MDXComponents } from "mdx/types";
import { contentMdxComponents } from "@/components/mdx/content-components";

export function useMDXComponents(): MDXComponents {
  return contentMdxComponents;
}
