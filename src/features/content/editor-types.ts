export type EditorPostInitialData = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  authorName: string;
  authorRole: string;
  readingTime: number;
  coverImage: string;
  badgeColor: string;
  status: "DRAFT" | "PUBLISHED";
  scheduledAt?: string;
  relatedSlugs: string[];
};

export type RelatedPostCandidate = {
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export type NewsEditorInitialData = Omit<EditorPostInitialData, "category" | "authorRole" | "badgeColor" | "readingTime"> & {
  sources: Array<{ name: string; url: string }>;
  reportedAtLabel: string;
};
