import { Suspense, type ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminShellLoading } from "@/components/ui/page-loading-skeletons";
import { getAuthorPermissions } from "@/features/admin/server/author-permissions";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AdminShellLoading />}>
      <AuthorizedAdminLayout>{children}</AuthorizedAdminLayout>
    </Suspense>
  );
}

async function AuthorizedAdminLayout({
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
