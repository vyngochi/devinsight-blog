"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetch(`/api/posts/${slug}/views`, { method: "POST", keepalive: true }).catch(() => undefined);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [slug]);

  return null;
}
