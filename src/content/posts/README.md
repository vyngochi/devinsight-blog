# Viết bài mới

Mỗi bài viết là một file `.mdx` trong thư mục này. File cần export `metadata` và phần nội dung Markdown/MDX.

## Các bước thêm bài

1. Sao chép `git-co-ban-cho-sinh-vien.mdx` và đổi tên file theo slug, ví dụ `lo-trinh-hoc-react.mdx`.
2. Cập nhật `metadata`: `slug`, `title`, `excerpt`, `category`, `badgeColor`, `publishedAt`, `updatedAt`, `readingTime`, `tags` và `author`. Thêm `coverImage` khi đã có ảnh chia sẻ 1200x630.
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
  updatedAt: "2026-08-03",
  readingTime: "8 phút",
  tags: ["React", "Frontend"],
  author: {
    name: "DevInsight Team",
    role: "Biên soạn bởi sinh viên Kỹ thuật phần mềm",
  },
  coverImage: "/images/posts/lo-trinh-hoc-react-og.png",
};
```

`category` chỉ dùng một trong các giá trị: `Học tập`, `Mẹo nhanh`, `Khám phá`, `Tài nguyên`, `Cộng đồng`.

`coverImage` phải là đường dẫn ảnh công khai, ưu tiên tỷ lệ 1200x630 để dùng cho Open Graph, Twitter và dữ liệu có cấu trúc Article.
