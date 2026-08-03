"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface StickerCardProps {
  children: React.ReactNode;
  className?: string;
  shadowColor?: "default" | "pink" | "violet" | "yellow" | "mint";
  hoverWiggle?: boolean;
  bg?: string;
  badge?: React.ReactNode;
}

export function StickerCard({
  children,
  className,
  shadowColor = "default",
  hoverWiggle = true,
  bg = "bg-white",
  badge,
}: StickerCardProps) {
  const shadowMap = {
    default: "shadow-pop-lg hover:shadow-pop-xl",
    pink: "shadow-pop-pink hover:shadow-[8px_8px_0px_0px_#F472B6]",
    violet: "shadow-pop-violet hover:shadow-[8px_8px_0px_0px_#8B5CF6]",
    yellow: "shadow-pop-yellow hover:shadow-[8px_8px_0px_0px_#FBBF24]",
    mint: "shadow-pop-mint hover:shadow-[8px_8px_0px_0px_#34D399]",
  };

  return (
    <div
      className={twMerge(
        "relative rounded-2xl border-2 border-[#1E293B] p-6 transition-all duration-300",
        bg,
        shadowMap[shadowColor],
        hoverWiggle && "hover:-translate-y-1 hover:-rotate-1 hover:scale-[1.01]",
        className
      )}
    >
      {badge && (
        <div className="absolute -top-4 right-6 z-10">
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}
