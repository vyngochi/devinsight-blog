import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAuthorPermissions } from "@/features/admin/server/author-permissions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUTHOR") notFound();
  const authorPermissions = session.user.role === "AUTHOR" ? await getAuthorPermissions() : undefined;
  return <AdminShell admin={session.user} permissions={authorPermissions}>{children}</AdminShell>;
}
