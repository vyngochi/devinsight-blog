import type { ReactNode } from "react";

const styles = {
  tip: "bg-[#34D399] text-[#1E293B]",
  note: "bg-[#FBBF24] text-[#1E293B]",
};

export function Callout({
  children,
  type = "tip",
}: {
  children: ReactNode;
  type?: keyof typeof styles;
}) {
  return (
    <aside
      className={`my-6 rounded-xl border-2 border-[#1E293B] p-5 shadow-pop-sm ${styles[type]}`}
    >
      {children}
    </aside>
  );
}
