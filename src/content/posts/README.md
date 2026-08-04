# Viết bài mới

Mỗi bài viết là một file `.mdx` trong thư mục này. File cần export `metadata` và phần nội dung Markdown/MDX.

## Các bước thêm bài

1. Sao chép `git-co-ban-cho-sinh-vien.mdx` và đổi tên file theo slug, ví dụ `lo-trinh-hoc-react.mdx`.
2. Cập nhật `metadata`: `slug`, `title`, `excerpt`, `category`, `badgeColor`, `publishedAt`, `readingTime` và `tags`.
3. Import file mới vào `src/features/content/post-registry.ts`, sau đó thêm module và metadata vào mảng `modules`.
4. Chạy `npm run lint` và `npm run build` để kiểm tra route `/posts/<slug>` được tạo tĩnh.

Khai báo ngôn ngữ sau ba dấu backtick cho các khối code để nhận syntax highlighting, ví dụ `bash`, `ts`, `tsx`, `json` hoặc `css`.

## Metadata bắt buộc

```ts
export const metadata = {
  slug: "lo-trinh-hoc-react",
  title: "Lộ trình học React cho người mới",
  excerpt: "Mô tả ngắn để hiển thị trên trang danh sách và metadata SEO.",
  category: "Học tập",
  badgeColor: "violet",
  publishedAt: "2026-08-03",
  readingTime: "8 phút",
  tags: ["React", "Frontend"],
};
```

`category` chỉ dùng một trong các giá trị: `Học tập`, `Mẹo nhanh`, `Khám phá`, `Tài nguyên`, `Cộng đồng`.
