# Chức năng hồ sơ cá nhân

## Phạm vi

- Route `/profile` chỉ dành cho người đã đăng nhập.
- Thành viên có thể đổi tên hiển thị, tải avatar mới hoặc xóa avatar hiện tại.
- Email và vai trò chỉ được hiển thị, không chỉnh sửa từ trang hồ sơ.
- Avatar hỗ trợ JPG, PNG và WebP, tối đa 5 MB.
- Upload avatar cần các biến môi trường R2 hiện có của dự án (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`).

## Luồng dữ liệu

1. Server Action xác thực session và không nhận `userId` từ client.
2. File ảnh được kiểm tra MIME type, extension và dung lượng trước khi tải lên R2.
3. Database lưu đường dẫn nội bộ `/api/profile/avatar/...`, không lưu signed URL có thời hạn.
4. Sau khi cập nhật, client gọi `useSession().update()`; JWT callback đọc lại hồ sơ từ database thay vì tin dữ liệu gửi từ trình duyệt.
5. Avatar R2 cũ do DevInsight quản lý được xóa sau khi database cập nhật thành công.

## File chính

- `app/(blog)/profile/page.tsx`: trang hồ sơ.
- `src/features/profile/components/profile-form.tsx`: form tên và avatar.
- `src/features/profile/server/profile.actions.ts`: Server Action có kiểm tra session.
- `src/features/profile/server/profile.service.ts`: validation, upload và dọn avatar cũ.
- `src/features/profile/server/profile.repository.ts`: truy vấn Prisma có `select` giới hạn trường.
- `app/api/profile/avatar/[...key]/route.ts`: chuyển hướng đến signed URL R2.
