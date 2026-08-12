"use client";

import { useCallback, useEffect, useState } from "react";

const leaveMessage = "Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời khỏi trang?";

export function useEditorSafety() {
  const [dirty, setDirty] = useState(false);
  const [changeVersion, setChangeVersion] = useState(0);

  useEffect(() => {
    if (!dirty) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirty]);

  const markDirty = useCallback(() => {
    setDirty(true);
    setChangeVersion((current) => current + 1);
  }, []);
  const markSaved = useCallback(() => setDirty(false), []);
  const confirmNavigation = useCallback(
    () => !dirty || window.confirm(leaveMessage),
    [dirty],
  );

  return { dirty, changeVersion, markDirty, markSaved, confirmNavigation };
}
