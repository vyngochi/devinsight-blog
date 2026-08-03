import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DevInsight | Blog học lập trình và công nghệ cho sinh viên",
  description:
    "Blog kỹ thuật Việt Nam chia sẻ hướng dẫn lập trình, mẹo nhanh, tài nguyên hữu ích và tin công nghệ dành cho sinh viên.",
  keywords: [
    "DevInsight",
    "học lập trình",
    "JavaScript",
    "TypeScript",
    "tài nguyên lập trình",
    "tin công nghệ",
  ],
  authors: [{ name: "DevInsight Team" }],
  openGraph: {
    title: "DevInsight | Học lập trình và cập nhật công nghệ",
    description:
      "Hướng dẫn, mẹo nhanh, tài nguyên và góc nhìn công nghệ dành cho cộng đồng học phần mềm.",
    url: "https://devinsight.io.vn",
    siteName: "DevInsight",
    locale: "vi_VN",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/Brand/Logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/Brand/Logo.png",
    apple: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDF5] text-[#1E293B] font-sans selection:bg-[#FBBF24] selection:text-[#1E293B]">
        {children}
      </body>
    </html>
  );
}
