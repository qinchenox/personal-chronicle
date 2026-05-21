"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/i18n";

export function usePolishSection(section: string) {
  const [polishing, setPolishing] = useState(false);
  const [polishError, setPolishError] = useState("");
  const locale = useLocale();

  const polish = useCallback(async (content: string): Promise<string | null> => {
    setPolishing(true);
    setPolishError("");
    try {
      const res = await fetch("/api/polish-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, content, locale }),
      });
      const json = await res.json();
      if (!json.success) {
        setPolishError(json.error || "润色失败");
        return null;
      }
      return json.polished as string;
    } catch {
      setPolishError("网络错误");
      return null;
    } finally {
      setPolishing(false);
    }
  }, [section, locale]);

  return { polish, polishing, polishError };
}
