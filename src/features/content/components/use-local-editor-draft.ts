"use client";

import {
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from "react";

export type LocalEditorDraft = {
  fields: Record<string, string>;
  savedAt: number;
};

function readDraft(storageKey: string) {
  try {
    const value = window.localStorage.getItem(storageKey);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<LocalEditorDraft>;
    if (!parsed.fields || typeof parsed.savedAt !== "number") return null;
    return parsed as LocalEditorDraft;
  } catch {
    return null;
  }
}

function readHistory(storageKey: string) {
  try {
    const value = window.localStorage.getItem(`${storageKey}:history`);
    if (!value) return [];
    const parsed = JSON.parse(value) as LocalEditorDraft[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.fields && typeof item.savedAt === "number").slice(0, 10) : [];
  } catch {
    return [];
  }
}

export function useLocalEditorDraft({
  storageKey,
  formRef,
  dirty,
  changeVersion,
}: {
  storageKey: string;
  formRef: RefObject<HTMLFormElement | null>;
  dirty: boolean;
  changeVersion: number;
}) {
  const [recoveryDraft, setRecoveryDraft] = useState<LocalEditorDraft | null>(
    null,
  );
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<number | null>(null);
  const [draftHistory, setDraftHistory] = useState<LocalEditorDraft[]>([]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setRecoveryDraft(readDraft(storageKey));
      setDraftHistory(readHistory(storageKey));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [storageKey]);

  useEffect(() => {
    if (!dirty || changeVersion === 0) return;
    const timeout = window.setTimeout(() => {
      const form = formRef.current;
      if (!form) return;
      const fields: Record<string, string> = {};
      for (const [name, value] of new FormData(form)) {
        if (typeof value === "string" && name !== "intent") fields[name] = value;
      }
      const savedAt = Date.now();
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ fields, savedAt } satisfies LocalEditorDraft),
      );
      setDraftHistory((current) => {
        const snapshot = { fields, savedAt } satisfies LocalEditorDraft;
        const previous = current[0];
        const unchanged = previous && JSON.stringify(previous.fields) === JSON.stringify(fields);
        const next = unchanged ? current : [snapshot, ...current].slice(0, 10);
        window.localStorage.setItem(`${storageKey}:history`, JSON.stringify(next));
        return next;
      });
      setLastAutoSavedAt(savedAt);
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [changeVersion, dirty, formRef, storageKey]);

  const clearLocalDraft = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setRecoveryDraft(null);
    setLastAutoSavedAt(null);
  }, [storageKey]);

  const dismissRecovery = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setRecoveryDraft(null);
  }, [storageKey]);

  const acceptRecovery = useCallback(() => {
    setRecoveryDraft(null);
  }, []);

  return {
    recoveryDraft,
    lastAutoSavedAt,
    clearLocalDraft,
    dismissRecovery,
    acceptRecovery,
    draftHistory,
  };
}
