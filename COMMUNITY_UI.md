# Giao diện Cộng đồng

## Hướng thiết kế

- Cộng đồng dùng bố cục `compact discussion feed`, trung tính hơn các trang marketing.
- Typography nhỏ và khoảng cách dọc gọn để hiển thị nhiều nội dung trong một khung hình.
- Màu tím là accent chính. Viền và divider dùng slate, hạn chế shadow và card lồng nhau.
- Câu hỏi gốc là khối nội dung nổi bật; câu trả lời dùng một danh sách liên tục có divider.
- Reply nằm trong nền slate nhạt bên dưới câu trả lời gốc, không tạo thêm card viền dày.

## Avatar

- Dùng `CommunityAuthorMeta` cho câu hỏi, câu trả lời và reply.
- Thành viên công khai dùng `author.image`; nếu không có ảnh thì hiện initials.
- Nội dung ẩn danh không được truyền avatar thật vào UI và dùng initials từ tên ẩn danh.

## Report popover

- Nút Báo cáo mở popover có `role="dialog"`.
- Click bên ngoài hoặc nhấn Escape phải đóng popover.
- Click và thao tác bên trong form không được làm popover đóng.
- Chỉ component popover là Client Component; nội dung thảo luận vẫn render từ Server Component.

## Responsive

- Dưới `sm`, metadata tác giả xếp trên nội dung câu hỏi.
- Title phải tự xuống dòng và trang không được có horizontal overflow.
- Reply bỏ phần thụt trái lớn trên mobile, chỉ giữ nền phân cấp.
