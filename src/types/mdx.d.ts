declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { PostMetadata } from "@/types/blog";

  export const metadata: PostMetadata;
  const MDXContent: ComponentType<{ components?: Record<string, ComponentType> }>;
  export default MDXContent;
}
