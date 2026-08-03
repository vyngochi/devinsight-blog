import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DevInsight | Blog học lập trình và công nghệ",
    short_name: "DevInsight",
    description:
      "Blog kỹ thuật chia sẻ hướng dẫn lập trình, tài nguyên và tin công nghệ dành cho sinh viên.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF5",
    theme_color: "#8B5CF6",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
