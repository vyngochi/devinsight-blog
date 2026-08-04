import { searchEverything } from "@/features/search/server/global-search.service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  try {
    const results = await searchEverything(query);
    return Response.json({ results }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "Tìm kiếm đang tạm thời không khả dụng." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
