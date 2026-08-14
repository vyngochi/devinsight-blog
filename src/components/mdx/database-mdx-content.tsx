import { MDXRemote } from "next-mdx-remote/rsc";
import { contentMdxComponents } from "@/components/mdx/content-components";

export async function DatabaseMdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={contentMdxComponents} />;
}
