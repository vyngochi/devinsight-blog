import { getAvatarAccessUrl } from "@/features/profile/server/profile.service";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: Promise<{ key: string[] }> }) {
  try {
    const url = await getAvatarAccessUrl((await context.params).key);
    if (!url) return new Response("Not found", { status: 404 });
    return Response.redirect(url, 307);
  } catch {
    return new Response("Avatar unavailable", { status: 503 });
  }
}
