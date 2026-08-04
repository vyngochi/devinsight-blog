import "server-only";

import { getAllPosts } from "@/features/content/post-registry";
import { findPublishedPostViewCounts } from "@/features/content/server/post-listing.repository";
import type { PostSummary } from "@/types/blog";

export type PostListItem = PostSummary & {
  readerCount: number;
};

export async function getPostListing(): Promise<PostListItem[]> {
  const posts = getAllPosts();
  const viewCounts = await findPublishedPostViewCounts(posts.map((post) => post.slug));

  return posts.map((post) => ({
    ...post,
    readerCount: viewCounts.get(post.slug) ?? 0,
  }));
}
