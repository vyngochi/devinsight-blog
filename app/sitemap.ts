import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getCommunityQuestions } from "@/features/community/server/community.service";
import { getPostListing } from "@/features/content/server/post-listing.service";
import { getPublicResources } from "@/features/resources/server/resources.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, questions, resources] = await Promise.all([
    getPostListing(),
    getCommunityQuestions({}),
    getPublicResources({}),
  ]);
  const latestPostDate = posts.at(0)?.updatedAt ?? posts.at(0)?.publishedAt;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/posts"),
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/resources"),
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/community"),
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...questions.map((question) => ({
      url: absoluteUrl(`/community/${question.slug}`),
      lastModified: question.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...resources.map((resource) => ({
      url: absoluteUrl(`/resources/${resource.slug}`),
      lastModified: resource.published_at ?? resource.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
