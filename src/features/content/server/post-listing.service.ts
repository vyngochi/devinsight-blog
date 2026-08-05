import "server-only";

import { getAllPosts } from "@/features/content/post-registry";
import { getDatabasePostSummaries } from "@/features/content/server/post-editor.service";
import { findPublishedPostViewCounts } from "@/features/content/server/post-listing.repository";
import type { PostSummary } from "@/types/blog";

export type PostListItem = PostSummary & {
  readerCount: number;
};

export async function getPostListing(): Promise<PostListItem[]> {
  const [legacyPosts, databasePosts] = await Promise.all([
    Promise.resolve(getAllPosts()),
    getDatabasePostSummaries(),
  ]);
  const posts = [...databasePosts, ...legacyPosts].sort(
    (first, second) =>
      Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
  );
  const viewCounts = await findPublishedPostViewCounts(
    posts.map((post) => post.slug),
  );

  return posts.map((post) => ({
    ...post,
    readerCount: viewCounts.get(post.slug) ?? 0,
  }));
}
