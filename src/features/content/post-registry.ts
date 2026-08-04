import "server-only";

import GitForStudentsPost, {
  metadata as gitForStudentsMetadata,
} from "@/content/posts/git-co-ban-cho-sinh-vien.mdx";
import type { PostMetadata, PostModule, PostSummary } from "@/types/blog";

const modules: PostModule[] = [
  {
    default: GitForStudentsPost,
    metadata: gitForStudentsMetadata as PostMetadata,
  },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function getAllPosts(): PostSummary[] {
  return modules
    .map(({ metadata }) => ({
      ...metadata,
      dateLabel: formatDate(metadata.publishedAt),
    }))
    .sort(
      (first, second) =>
        Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
    );
}

export function getPostBySlug(slug: string): PostModule | undefined {
  return modules.find((post) => post.metadata.slug === slug);
}
