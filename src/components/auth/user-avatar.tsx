"use client";

import { useState } from "react";

function initials(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.split("@")[0] || "DI";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("vi-VN"))
    .join("");
}

export function UserAvatar({
  name,
  email,
  image,
  preview,
  size = "md",
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  preview?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const source = preview || image;
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = source === failedSource;

  const sizes = { sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-28 w-28 text-2xl" };
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#1E293B] bg-[#EDE9FE] font-extrabold text-[#6D28D9] shadow-pop-sm ${sizes[size]}`}>
      {initials(name, email)}
      {source && !failed ? (
        // OAuth avatars can come from providers not listed in next/image remotePatterns.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={source} alt="" className="absolute inset-0 h-full w-full object-cover" onError={() => setFailedSource(source)} />
      ) : null}
    </span>
  );
}
