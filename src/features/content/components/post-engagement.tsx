"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Heart, LogIn, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  createPostCommentAction,
  togglePostLikeAction,
  type PostEngagementState,
} from "@/features/content/server/post-engagement.actions";

type CommentItem = {
  id: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
};

const initialState: PostEngagementState = {};

export function PostEngagement({
  slug,
  signedIn,
  initialLiked,
  initialLikeCount,
  comments,
}: {
  slug: string;
  signedIn: boolean;
  initialLiked: boolean;
  initialLikeCount: number;
  comments: CommentItem[];
}) {
  const [authOpen, setAuthOpen] = useState(false);
  const [likeState, likeAction, likePending] = useActionState(
    togglePostLikeAction,
    initialState,
  );
  const [commentState, commentAction, commentPending] = useActionState(
    createPostCommentAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const liked = likeState.liked ?? initialLiked;
  const likeCount = likeState.count ?? initialLikeCount;

  useEffect(() => {
    if (commentState.success) formRef.current?.reset();
  }, [commentState.success]);

  return (
    <section
      className="border-t-2 border-[#1E293B] pt-8"
      aria-labelledby="post-discussion-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="post-discussion-title"
            className="mt-2 text-2xl font-extrabold text-[#1E293B]"
          >
            Bình luận
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            {comments.length} bình luận
          </p>
        </div>
        {signedIn ? (
          <form action={likeAction}>
            <input type="hidden" name="slug" value={slug} />
            <button
              disabled={likePending}
              className={
                "inline-flex items-center gap-2 rounded-xl border-2 border-[#1E293B] px-4 py-2.5 text-sm font-extrabold shadow-pop-sm active:translate-y-px disabled:opacity-60 " +
                (liked
                  ? "bg-[#FFF1F2] text-[#BE123C]"
                  : "bg-white text-[#334155]")
              }
            >
              <Heart className={"h-5 w-5 " + (liked ? "fill-current" : "")} />
              {liked ? "Đã thích" : "Thích bài viết"} ·{" "}
              {likeCount.toLocaleString("vi-VN")}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1E293B] bg-white px-4 py-2.5 text-sm font-extrabold shadow-pop-sm"
          >
            <Heart className="h-5 w-5" /> Thích ·{" "}
            {likeCount.toLocaleString("vi-VN")}
          </button>
        )}
      </div>

      <div className="mt-7">
        {signedIn ? (
          <form
            ref={formRef}
            action={commentAction}
            className="rounded-xl border-2 border-[#1E293B] bg-white p-4 shadow-pop-sm"
          >
            <input type="hidden" name="slug" value={slug} />
            <label
              htmlFor="post-comment"
              className="text-sm font-extrabold text-[#334155]"
            >
              Chia sẻ suy nghĩ của bạn
            </label>
            <textarea
              id="post-comment"
              name="content"
              required
              maxLength={1000}
              rows={4}
              placeholder="Viết bình luận rõ ràng và tôn trọng..."
              className="mt-2 block w-full resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-3 text-sm leading-6 outline-none focus:border-[#7C3AED]"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-[#64748B]">Tối đa 1.000 ký tự</span>
              <button
                disabled={commentPending}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2 text-sm font-extrabold disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {commentPending ? "Đang đăng..." : "Đăng bình luận"}
              </button>
            </div>
            {commentState.error ? (
              <p role="alert" className="mt-3 text-sm font-bold text-[#BE123C]">
                {commentState.error}
              </p>
            ) : null}
            {commentState.success ? (
              <p
                role="status"
                className="mt-3 text-sm font-bold text-[#047857]"
              >
                {commentState.success}
              </p>
            ) : null}
          </form>
        ) : (
          <div className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-4">
            <p className="font-extrabold text-[#78350F]">
              Đăng nhập để tham gia thảo luận
            </p>
            <p className="mt-1 text-sm text-[#92400E]">
              Tài khoản giúp bảo vệ bình luận và lượt thích khỏi thao tác trùng.
            </p>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-extrabold text-white"
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập hoặc đăng ký
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {comments.length ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className={
                "flex gap-3 rounded-xl border border-[#CBD5E1] bg-white p-4 " +
                (comment.parentId ? "ml-8" : "")
              }
            >
              {comment.user.image ? (
                <Image
                  src={comment.user.image}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EDE9FE] font-extrabold text-[#6D28D9]">
                  {(comment.user.name || "D").charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-sm font-extrabold text-[#1E293B]">
                    {comment.user.name || "Độc giả DevInsight"}
                  </h3>
                  <time
                    className="text-xs text-[#64748B]"
                    dateTime={comment.createdAt}
                  >
                    {new Intl.DateTimeFormat("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(comment.createdAt))}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#334155]">
                  {comment.content}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[#94A3B8] px-5 py-8 text-center">
            <MessageCircle className="mx-auto h-7 w-7 text-[#8B5CF6]" />
            <p className="mt-2 text-sm font-bold text-[#475569]">
              Chưa có bình luận. Hãy mở đầu cuộc trò chuyện.
            </p>
          </div>
        )}
      </div>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        callbackUrl={"/posts/" + slug}
      />
    </section>
  );
}
