"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wide rounded-full border-2 border-[#1E293B] transition-all duration-200 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-2.5",
    lg: "px-8 py-4 text-lg gap-3",
  };

  const variantStyles = {
    primary:
      "bg-[#8B5CF6] text-white shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:shadow-pop-sm",
    secondary:
      "bg-[#F472B6] text-white shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:shadow-pop-sm",
    tertiary:
      "bg-[#FBBF24] text-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:shadow-pop-sm",
    outline:
      "bg-white text-[#1E293B] shadow-pop hover:bg-[#FBBF24] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:shadow-pop-sm",
    ghost:
      "bg-transparent border-transparent text-[#1E293B] hover:bg-[#F1F5F9] active:bg-[#E2E8F0]",
  };

  return (
    <button
      className={twMerge(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {icon && (
        <span className="w-7 h-7 rounded-full bg-white text-[#1E293B] flex items-center justify-center border border-[#1E293B] shrink-0">
          {icon}
        </span>
      )}
    </button>
  );
}

export function Badge({
  children,
  color = "violet",
  className,
}: {
  children: React.ReactNode;
  color?: "violet" | "pink" | "yellow" | "mint" | "slate";
  className?: string;
}) {
  const colorMap = {
    violet: "bg-[#8B5CF6] text-white",
    pink: "bg-[#F472B6] text-white",
    yellow: "bg-[#FBBF24] text-[#1E293B]",
    mint: "bg-[#34D399] text-[#1E293B]",
    slate: "bg-[#F1F5F9] text-[#1E293B]",
  };

  return (
    <span
      className={twMerge(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-[#1E293B] shadow-pop-sm select-none",
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
