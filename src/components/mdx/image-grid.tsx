import type { ReactNode } from "react";

const layouts = {
  two: "sm:grid-cols-2",
  three: "sm:grid-cols-3",
  featured: "sm:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]",
};

export function ImageGrid({
  children,
  layout = "two",
}: {
  children: ReactNode;
  layout?: keyof typeof layouts;
}) {
  const selectedLayout = layouts[layout] ?? layouts.two;
  return (
    <div className={`my-7 grid gap-3 [&>p]:m-0 [&_img]:h-full [&_img]:w-full [&_img]:rounded-xl [&_img]:object-cover ${selectedLayout}`}>
      {children}
    </div>
  );
}
