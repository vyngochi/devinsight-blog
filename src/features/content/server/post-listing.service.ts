import "server-only";

import { unstable_cache } from "next/cache";
import { getAllPosts } from "@/features/content/post-registry";
import { getDatabasePostSummaries } from "@/features/content/server/post-editor.service";
import type { PostSummary } from "@/types/blog";

export type PostListItem = PostSummary & {
  readerCount: number;
};

async function buildPostListing(): Promise<PostListItem[]> {
  const [legacyPosts, databasePosts] = await Promise.all([
    Promise.resolve(getAllPosts()),
    getDatabasePostSummaries(),
  ]);
  const posts: PostListItem[] = [
    ...databasePosts,
    ...legacyPosts.map((post) => ({ ...post, readerCount: 0 })),
  ].sort(
    (first, second) =>
      Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
  );
  return posts;
}

export const getPostListing = unstable_cache(
  buildPostListing,
  ["public-post-listing"],
  { tags: ["public-post-listing"], revalidate: 60 },
);
