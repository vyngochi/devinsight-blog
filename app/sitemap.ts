import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getPostListing } from "@/features/content/server/post-listing.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostListing();
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
  ];
}
