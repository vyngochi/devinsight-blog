import { UserAvatar } from "@/components/auth/user-avatar";
import { getCommunityDisplayName } from "@/features/community/anonymous-name";

type CommunityAuthor = {
  id: string;
  name: string | null;
  image: string | null;
};

function formatCommunityDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date as Date);
}

export function CommunityAuthorMeta({
  author,
  isAnonymous,
  createdAt,
  size = "sm",
}: {
  author: CommunityAuthor;
  isAnonymous: boolean;
  createdAt: Date | string | number;
  size?: "sm" | "md";
}) {
  const displayName = getCommunityDisplayName({ ...author, isAnonymous });
  const dateObj = new Date(createdAt);
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <UserAvatar
        name={displayName}
        image={isAnonymous ? null : author.image}
        size={size}
      />
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#334155]">
          {displayName}
        </p>
        <p className="mt-0.5 text-[11px] text-[#64748B]">
          <time dateTime={dateObj.toISOString()}>
            {formatCommunityDate(dateObj)}
          </time>
          {isAnonymous ? <span> · Ẩn danh</span> : null}
        </p>
      </div>
    </div>
  );
}
