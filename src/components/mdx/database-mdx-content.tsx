import { MDXRemote } from "next-mdx-remote/rsc";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";

export async function DatabaseMdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={{ Callout, pre: CodeBlock }} />;
}
