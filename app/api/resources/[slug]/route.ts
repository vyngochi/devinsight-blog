import { getResourceAccessUrl } from "@/features/resources/server/resources.service";

export const runtime = "nodejs";

export async function GET(request: Request, context: RouteContext<"/api/resources/[slug]">) {
  const { slug } = await context.params;
  const download = new URL(request.url).searchParams.get("download") === "1";
  try {
    const url = await getResourceAccessUrl(slug, download);
    if (!url) return new Response("Không tìm thấy tài nguyên.", { status: 404 });
    return Response.redirect(url, 307);
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Không thể mở tài nguyên.",
      { status: 503 },
    );
  }
}
