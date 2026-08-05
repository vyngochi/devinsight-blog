# Quy chuẩn UI DevInsight

## Theme

- DevInsight chỉ sử dụng light theme.
- Khóa theme bằng `color-scheme: light` trong `app/globals.css` và meta `color-scheme` trong root layout.
- Không thêm utility `dark:*` hoặc media query `prefers-color-scheme: dark` vào giao diện.
- Màu nền chính là `#FFFDF5`; các bề mặt nội dung dùng trắng hoặc slate rất nhạt.

## Typography

- Root font size là `15px`, giúp toàn bộ typography dùng đơn vị `rem` nhỏ hơn đồng đều khoảng 6,25% so với mặc định trình duyệt.
- Ưu tiên `text-xs` và `text-sm` cho metadata, form và nội dung phụ; `text-base` cho nội dung cần nhấn mạnh.
- Không giảm các nhãn cố định `10px` hoặc `11px` thêm nữa để giữ khả năng đọc.
- Chỉ dùng heading lớn khi thật sự cần phân cấp; tránh tăng cỡ chữ chỉ để tạo cảm giác nổi bật.

## Bài viết và Tài nguyên

- Trang Bài viết là news hub light-only, gồm hai luồng: Bài viết DevInsight và Tin tức công nghệ.
- Tin tức công nghệ được nhận diện bởi chuyên mục `Khám phá` hoặc tag `news`, `tin-tuc`, `tin tức`, `cong-nghe`, `công nghệ`.
- Card bài viết phải có ảnh bìa. Dùng `coverImage` khi có; nếu dữ liệu cũ thiếu ảnh, dùng `/images/posts/devinsight-cover-fallback.png`.
- Tài nguyên ưu tiên `text-xs` và `text-sm`; chỉ title trang hoặc tài liệu chi tiết mới dùng `text-2xl` trở lên.

## Trang chủ

- Giữ nguyên Hero và khối Mới cập nhật khi điều chỉnh nội dung Home.
- Khối nội dung ngay sau dải công nghệ là “Công nghệ đáng theo dõi”, ưu tiên bài thuộc chuyên mục `Khám phá` hoặc có tag tin công nghệ; nếu chưa có, hiển thị bài mới để khu vực luôn hữu ích.
- Bố cục là một bài nổi bật có ảnh bìa và danh sách bài phụ, không dùng các card “cách học” hoặc mô tả nền tảng như một khoá học.

## Biên tập tin tức

- Admin soạn tin tại `/admin/news/new`, tách riêng khỏi editor Bài viết.
- Tin tức tự dùng chuyên mục `Khám phá`, badge hồng và các tag `news`, `tin tức`, `công nghệ` để xuất hiện trong dòng Tin tức công nghệ.
- Form tin gồm headline, lead, nguồn/link, thời điểm tin, ảnh cover và tags bổ sung. Nguồn được thêm vào cuối nội dung đã xuất bản để độc giả kiểm tra.
- Editor tin ưu tiên paragraph, heading và ảnh; không khởi tạo code block hoặc callout như editor bài viết kỹ thuật.
- Admin có thể sửa và xóa nội dung database từ danh sách `/admin/posts` và `/admin/news`; trước khi xóa luôn hiện xác nhận. Bài MDX quản lý trong `src/content/posts` chỉ hiển thị trạng thái quản lý từ source, không cho xóa/sửa trong admin.

## Bố cục ảnh trong editor

- Cả editor Bài viết và Tin tức có block `Bộ ảnh`, chứa 2 hoặc 3 ảnh trên cùng một dòng ở desktop và tự xếp một cột trên mobile.
- Bộ ảnh có ba layout: hai ảnh đều nhau, ba ảnh đều nhau, hoặc ảnh chính kèm ảnh phụ. Từng ảnh có upload, URL, alt text và nút thay đổi thứ tự.
- Nội dung được lưu bằng MDX component `ImageGrid`; chỉ sử dụng layout `two`, `three` hoặc `featured` để validator và trang đọc render an toàn.

## Khi thêm UI mới

1. Kiểm tra ở desktop và mobile với light theme.
2. Đảm bảo text, placeholder và trạng thái focus có độ tương phản rõ.
3. Dùng scale typography hiện có, không tạo thêm cỡ chữ tùy ý nếu không cần thiết.
4. Chạy tìm kiếm `dark:` và `prefers-color-scheme: dark` trước khi hoàn tất.

## Role AUTHOR và quyền

- `AUTHOR` chỉ dùng Author Studio tại `/admin`; không có quyền quản lý người dùng hoặc cấu hình hệ thống.
- Admin cấu hình quyền mặc định cho AUTHOR tại `/admin/settings`: tổng quan bài của mình, viết bài, viết tin, kiểm duyệt Cộng đồng và quản lý Tài nguyên.
- Nội dung do AUTHOR tạo được gắn `author_id`; danh sách, sửa và xóa chỉ giới hạn vào nội dung/tài nguyên của chính họ. ADMIN vẫn có toàn quyền.
- Với nội dung database có từ trước khi thêm `author_id`, dùng `prisma/backfill_author_posts.sql` để liên kết khi tên/email tác giả chỉ khớp duy nhất một tài khoản; dữ liệu mơ hồ không tự gán.
