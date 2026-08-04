import { getPostImageAccessUrl } from "@/features/content/server/post-image.service";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/post-images/[...key]">,
) {
  try {
    const { key } = await context.params;
    const accessUrl = await getPostImageAccessUrl(key);
    if (!accessUrl) return new Response("Không tìm thấy hình ảnh.", { status: 404 });
    return Response.redirect(accessUrl, 307);
  } catch {
    return new Response("Không thể mở hình ảnh.", { status: 503 });
  }
}
