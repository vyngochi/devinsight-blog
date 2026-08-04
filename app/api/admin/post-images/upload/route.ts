import { auth } from "@/auth";
import { uploadPostImage } from "@/features/content/server/post-image.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return Response.json({ error: "Bạn không có quyền tải ảnh lên." }, { status: 403 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File))
      return Response.json({ error: "Chưa chọn hình ảnh để tải lên." }, { status: 400 });

    const image = await uploadPostImage({
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      body: new Uint8Array(await file.arrayBuffer()),
    });
    return Response.json(image);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể tải hình ảnh lên." },
      { status: 400 },
    );
  }
}
