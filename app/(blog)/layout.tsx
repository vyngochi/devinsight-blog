import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-[#FFFDF5]"><Header /><main className="flex-1">{children}</main><Footer /></div>;
}
