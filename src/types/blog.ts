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
  updatedAt?: string;
  readingTime: string;
  tags: string[];
  author: PostAuthor;
  coverImage?: string;
  featured?: boolean;
}

export interface PostSummary extends PostMetadata {
  dateLabel: string;
}
