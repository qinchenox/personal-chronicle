"use client";

import { useState, useRef, useCallback } from "react";
import { useResumeStore } from "@/store/resume-store";
import { t } from "@/i18n";

interface SupplementFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export function SupplementPanel() {
  const data = useResumeStore((s) => s.data);
  const setData = useResumeStore((s) => s.setData);
  const agentId = useResumeStore((s) => s.agentId);
  const [collapsed, setCollapsed] = useState(true);
  const [files, setFiles] = useState<SupplementFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // URL input
  const [urlInput, setUrlInput] = useState("");
  const [urlFetching, setUrlFetching] = useState(false);

  const handleUrlFetch = useCallback(async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setError(null);
    setResult(null);
    setUrlFetching(true);
    try {
      const res = await fetch("/api/supplement-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: trimmed,
          currentData: JSON.stringify(data),
          agentId,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || t("edit.supplementPanel.urlError"));
        setUrlFetching(false);
        return;
      }
      setData(json.data);
      setResult(t("edit.supplementPanel.urlSuccess"));
      setUrlInput("");
    } catch {
      setError(t("edit.supplementPanel.urlError"));
    }
    setUrlFetching(false);
  }, [urlInput, data, agentId, setData]);

  const handleFile = useCallback(async (f: File) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|docx)$/i)) {
      setError(t("upload.invalidFormat"));
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError(t("upload.fileTooLarge"));
      return;
    }

    setError(null);
    setResult(null);
    setMerging(true);

    const formData = new FormData();
    formData.append("file", f);
    formData.append("currentData", JSON.stringify(data));
    formData.append("agentId", agentId);

    try {
      const res = await fetch("/api/supplement", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || t("edit.supplementMsg.failed"));
        setMerging(false);
        return;
      }
      setData(json.data);
      setFiles((prev) => [
        {
          id: Date.now().toString(),
          name: f.name,
          size: (f.size / 1024).toFixed(1) + " KB",
          uploadedAt: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      setResult(t("edit.supplementMsg.success"));
    } catch {
      setError(t("states.networkError"));
    }
    setMerging(false);
  }, [data, agentId, setData]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragover(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors"
      >
        <span className="text-sm font-medium text-neutral-700">{t("edit.supplementPanel.title")}</span>
        <span className={`text-xs text-neutral-400 transition-transform ${collapsed ? "" : "rotate-180"}`}>
          ▼
        </span>
      </button>

      {!collapsed && (
        <div className="p-4 space-y-3">
          <p className="text-xs text-neutral-400">
            {t("edit.supplementPanel.description")}
          </p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
              dragover ? "border-accent bg-accent/5" : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              className="hidden"
            />
            <div className="text-lg mb-1">📎</div>
            <p className="text-xs text-neutral-500">
              {t("edit.supplementPanel.uploadHint")}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">{t("upload.formats")}</p>
          </div>

          {/* URL input */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500">{t("edit.supplementPanel.urlInput")}</p>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleUrlFetch(); }}
                placeholder={t("edit.supplementPanel.urlPlaceholder")}
                className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                disabled={urlFetching}
              />
              <button
                onClick={handleUrlFetch}
                disabled={urlFetching || !urlInput.trim()}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent text-white hover:opacity-90 disabled:opacity-40 transition-opacity whitespace-nowrap"
              >
                {urlFetching ? t("edit.supplementPanel.urlFetching") : t("edit.supplementPanel.urlFetch")}
              </button>
            </div>
          </div>

          {merging && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              {t("edit.supplementPanel.merging")}
            </div>
          )}

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
          )}

          {result && (
            <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">{result}</div>
          )}

          {files.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-neutral-500">{t("edit.supplementMsg.uploaded")}</p>
              {files.map((f) => (
                <div key={f.id} className="flex items-center justify-between text-xs text-neutral-600 bg-neutral-50 rounded px-2 py-1.5">
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-neutral-400 mx-2">{f.size}</span>
                  <span className="text-neutral-400 mr-2">{f.uploadedAt}</span>
                  <button onClick={() => removeFile(f.id)} className="text-red-400 hover:text-red-600">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
