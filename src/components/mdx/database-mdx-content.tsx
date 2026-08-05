import { MDXRemote } from "next-mdx-remote/rsc";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { ImageGrid } from "@/components/mdx/image-grid";

export async function DatabaseMdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={{ Callout, ImageGrid, pre: CodeBlock }} />;
}
