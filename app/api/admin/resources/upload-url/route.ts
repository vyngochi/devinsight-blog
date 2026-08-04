import { auth } from "@/auth";
import { requestResourceUpload } from "@/features/resources/server/resources.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return Response.json({ error: "Bạn không có quyền tải tài nguyên lên." }, { status: 403 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const upload = await requestResourceUpload({
      fileName: body.fileName,
      mimeType: body.mimeType,
      fileSize: body.fileSize,
    });
    return Response.json(upload);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tạo phiên tải lên." },
      { status: 400 },
    );
  }
}
