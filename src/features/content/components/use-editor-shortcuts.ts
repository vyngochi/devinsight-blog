"use client";

import { useEffect, type RefObject } from "react";

export function useEditorShortcuts(formRef: RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        const saveButton = formRef.current?.querySelector<HTMLButtonElement>(
          "button[data-editor-save]",
        );
        saveButton?.click();
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        formRef.current?.querySelector<HTMLButtonElement>("button[data-editor-preview]")?.click();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formRef]);
}
