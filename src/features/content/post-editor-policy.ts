export const EDITOR_POST_CATEGORIES = [
  "Học tập",
  "Mẹo nhanh",
  "Khám phá",
  "Tài nguyên",
  "Cộng đồng",
] as const;

export const EDITOR_BADGE_COLORS = ["violet", "pink", "yellow", "mint"] as const;

export const editorCategorySlugs: Record<(typeof EDITOR_POST_CATEGORIES)[number], string> = {
  "Học tập": "hoc-tap",
  "Mẹo nhanh": "meo-nhanh",
  "Khám phá": "kham-pha",
  "Tài nguyên": "tai-nguyen",
  "Cộng đồng": "cong-dong",
};
