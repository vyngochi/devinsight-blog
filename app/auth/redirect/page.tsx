import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AuthRedirectPage() {
  const session = await auth();
  redirect(session?.user?.role === "ADMIN" ? "/admin" : "/");
}
