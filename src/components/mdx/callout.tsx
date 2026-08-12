import type { ReactNode } from "react";

const styles = {
  violet: "bg-[#F5F3FF] text-[#4C1D95]",
  blue: "bg-[#EFF6FF] text-[#1E3A8A]",
  green: "bg-[#ECFDF5] text-[#065F46]",
  yellow: "bg-[#FFFBEB] text-[#78350F]",
  red: "bg-[#FFF1F2] text-[#881337]",
};

export function Callout({
  children,
  type = "tip",
  tone,
  title,
}: {
  children: ReactNode;
  type?: "tip" | "note" | "info" | "warning" | "success" | "danger";
  tone?: keyof typeof styles;
  title?: string;
}) {
  const selectedTone =
    tone ??
    (type === "tip" || type === "success"
      ? "green"
      : type === "warning" || type === "note"
        ? "yellow"
        : type === "danger"
          ? "red"
          : "blue");
  return (
    <aside
      className={`my-6 rounded-xl p-5 shadow-pop-sm ${styles[selectedTone] ?? styles.blue}`}
    >
      {title ? <p className="mb-2 font-extrabold">{title}</p> : null}
      <div className="space-y-3 text-sm leading-7 [&>p]:m-0">{children}</div>
    </aside>
  );
}
