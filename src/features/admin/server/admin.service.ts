import "server-only";

import type { user_role } from "@/generated/prisma/client";
import { getDashboardMetrics } from "@/features/analytics/server/analytics.service";
import {
  fetchAdminPlatformMetrics,
  findUsers,
  findUserForRoleChange,
  setUserRole,
} from "@/features/admin/server/admin.repository";

export async function getAdminDashboardData() {
  const [analytics, platform] = await Promise.all([
    getDashboardMetrics(),
    fetchAdminPlatformMetrics(),
  ]);
  return { analytics, platform };
}

export function getSystemConfigurationStatus() {
  return [
    {
      label: "Cơ sở dữ liệu",
      description: "Kết nối PostgreSQL qua Prisma",
      configured: Boolean(process.env.DATABASE_URL),
    },
    {
      label: "Xác thực phiên",
      description: "Auth.js sử dụng AUTH_SECRET",
      configured: Boolean(process.env.AUTH_SECRET),
    },
    {
      label: "Gửi mã email",
      description: "SMTP cho mã đăng nhập một lần",
      configured: Boolean(
        process.env.SMTP_HOST &&
          process.env.SMTP_PORT &&
          process.env.SMTP_USER &&
          process.env.SMTP_PASSWORD &&
          process.env.EMAIL_FROM,
      ),
    },
    {
      label: "Email gộp Cộng đồng",
      description: "CRON_SECRET bảo vệ lịch gửi phản hồi đã gom",
      configured: Boolean(process.env.CRON_SECRET),
    },
    {
      label: "Google OAuth",
      description: "Đăng nhập bằng Google",
      configured: Boolean(
        process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
      ),
    },
    {
      label: "Facebook OAuth",
      description: "Đăng nhập bằng Facebook",
      configured: Boolean(
        process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET,
      ),
    },
  ];
}

export async function getManagedUsers(input: {
  query?: string;
  role?: user_role;
}) {
  return findUsers(input);
}

export async function changeManagedUserRole(input: {
  actorId: string;
  userId: string;
  role: user_role;
}) {
  const target = await findUserForRoleChange(input.userId);
  if (!target) throw new Error("Không tìm thấy người dùng.");
  if (target.id === input.actorId)
    throw new Error("Bạn không thể tự thay đổi quyền của mình.");
  if (
    process.env.ADMIN_EMAIL &&
    target.email.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase()
  )
    throw new Error("Không thể thay đổi quyền của email quản trị chính.");

  await setUserRole(target.id, input.role);
}
