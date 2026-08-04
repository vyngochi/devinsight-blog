import type { ComponentType } from "react";

export type PostCategory = "Học tập" | "Mẹo nhanh" | "Khám phá" | "Tài nguyên" | "Cộng đồng";
export type BadgeColor = "violet" | "pink" | "yellow" | "mint";

export interface PostAuthor {
  name: string;
  role?: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  badgeColor: BadgeColor;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  author: PostAuthor;
  featured?: boolean;
}

export interface PostSummary extends PostMetadata {
  dateLabel: string;
}

export interface PostModule {
  default: ComponentType<{ components?: Record<string, ComponentType> }>;
  metadata: PostMetadata;
}
