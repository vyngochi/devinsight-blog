import "server-only";

import { getPostListing } from "@/features/content/server/post-listing.service";
import { getCommunityQuestions } from "@/features/community/server/community.service";
import { getPublicResources } from "@/features/resources/server/resources.service";

export type GlobalSearchResult = {
  id: string;
  type: "Bài viết" | "Tài nguyên" | "Cộng đồng";
  title: string;
  description: string;
  meta: string;
  href: string;
};

function includesQuery(value: string, query: string) {
  return value.toLocaleLowerCase("vi-VN").includes(query);
}

export async function searchEverything(value: string) {
  const query = value.trim().slice(0, 100).toLocaleLowerCase("vi-VN");
  if (query.length < 2) return [] as GlobalSearchResult[];

  const [posts, resources, questions] = await Promise.all([
    getPostListing(),
    getPublicResources({ query }),
    getCommunityQuestions({ query }),
  ]);
  const postResults = posts
    .filter((post) =>
      [post.title, post.excerpt, post.category, post.author.name, ...post.tags]
        .some((field) => includesQuery(field, query)),
    )
    .slice(0, 5)
    .map((post) => ({
      id: `post:${post.slug}`,
      type: "Bài viết" as const,
      title: post.title,
      description: post.excerpt,
      meta: post.category,
      href: `/posts/${post.slug}`,
    }));
  const resourceResults = resources.slice(0, 5).map((resource) => ({
    id: `resource:${resource.id}`,
    type: "Tài nguyên" as const,
    title: resource.title,
    description: resource.description,
    meta: resource.topic,
    href: `/resources/${resource.slug}`,
  }));
  const communityResults = questions.slice(0, 5).map((question) => ({
    id: `community:${question.id}`,
    type: "Cộng đồng" as const,
    title: question.title,
    description: question.content_text,
    meta: question.topic,
    href: `/community/${question.slug}`,
  }));

  return [...postResults, ...resourceResults, ...communityResults];
}
