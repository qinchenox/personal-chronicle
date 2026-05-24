"use client";

import { useState, useCallback, useRef } from "react";
import { useResumeStore } from "@/store/resume-store";
import { generatePreviewHTML } from "@/lib/html-generator";
import { t } from "@/i18n";

export function PortfolioPreview() {
  const data = useResumeStore((s) => s.data);
  const [copyText, setCopyText] = useState("复制 HTML");
  const [downloading, setDownloading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deployWarning, setDeployWarning] = useState<string | null>(null);
  const [deployFallback, setDeployFallback] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewHTML = generatePreviewHTML(data);

  const openInNewTab = useCallback(() => {
    const blob = new Blob([previewHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.addEventListener("beforeunload", () => URL.revokeObjectURL(url));
    } else {
      // Fallback: revoke after timeout if popup blocked
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  }, [previewHTML]);

  const downloadHTML = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/generate-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { alert(t("portfolio.generateFailed")); setDownloading(false); return; }
      const html = await res.text();
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.basics.name || t("portfolio.personalHomepage")}-${t("portfolio.personalHomepage")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      // Auto-open after download
      const blob2 = new Blob([html], { type: "text/html;charset=utf-8" });
      const viewUrl = URL.createObjectURL(blob2);
      window.open(viewUrl, "_blank");
    } catch { alert(t("portfolio.downloadFailed")); }
    setDownloading(false);
  }, [data]);

  const copyHTML = useCallback(async () => {
    try {
      const res = await fetch("/api/generate-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { alert(t("portfolio.generateFailed")); return; }
      const html = await res.text();
      await navigator.clipboard.writeText(html);
      setCopyText(t("portfolio.copied"));
      setTimeout(() => setCopyText(t("portfolio.copyHTML")), 2000);
    } catch { alert(t("portfolio.copyFailed")); }
  }, [data]);

  const deploy = useCallback(async () => {
    setDeploying(true);
    setDeployError(null);
    setDeployWarning(null);
    setDeployFallback(false);
    setDeployUrl(null);
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const text = await res.text();
      let json: Record<string, unknown> = {};
      try { json = JSON.parse(text); } catch { /* not JSON */ }
      if (!res.ok || !json.success) {
        const errMsg = (json.error as string) || (res.status === 401 ? "请先登录" : null) || t("states.generateFailed");
        setDeployError(errMsg);
        setDeploying(false);
        return;
      }
      setDeployUrl(json.url as string);
      if (json.warning) setDeployWarning(json.warning as string);
      if (json.fallback) setDeployFallback(true);
      window.open(json.url as string, "_blank");
    } catch { setDeployError(t("portfolio.deployNetworkError")); }
    setDeploying(false);
  }, [data]);

  const qrCodeUrl = deployUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(deployUrl)}`
    : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-neutral-800">{t("portfolio.pageTitle")}</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={openInNewTab}
            className="px-4 py-2 text-sm font-medium text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            🔗 {t("portfolio.openNewWindow")}
          </button>
          <button
            onClick={copyHTML}
            className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            {copyText}
          </button>
          <button
            onClick={downloadHTML}
            disabled={downloading}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
            style={{ background: "var(--color-accent, #5b5fe1)" }}
          >
            {downloading ? t("portfolio.generating") : t("portfolio.download")}
          </button>
          <button
            onClick={deploy}
            disabled={deploying}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {deploying ? t("portfolio.publishing") : t("preview.publish")}
          </button>
        </div>
      </div>

      {deployUrl && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 mb-3">{t("portfolio.publishSuccess")}</p>
          <div className="flex gap-4 items-start flex-wrap">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  readOnly
                  value={deployUrl}
                  className="flex-1 px-3 py-1.5 text-sm border border-green-200 rounded bg-white text-green-800"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={() => { navigator.clipboard.writeText(deployUrl); }}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
                >
                  {t("portfolio.copy")}
                </button>
                <a
                  href={deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm bg-neutral-800 text-white rounded hover:bg-neutral-700 whitespace-nowrap"
                >
                  {t("portfolio.open")} ↗
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white p-2 rounded border border-neutral-200">
              <img src={qrCodeUrl} alt={t("portfolio.scanQR")} width={100} height={100} />
              <p className="text-xs text-neutral-400 text-center mt-1">{t("portfolio.scanQR")}</p>
            </div>
          </div>
          {deployWarning && (
            <p className="mt-3 text-xs text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded border border-yellow-200">{deployWarning}</p>
          )}
          {deployFallback && (
            <p className="mt-2 text-xs text-neutral-500">当前为本地模式，链接仅开发服务器可访问。配置 VERCEL_TOKEN 后可部署到公网。</p>
          )}
        </div>
      )}
      {deployError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{deployError}</div>
      )}

      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <iframe ref={iframeRef} srcDoc={previewHTML} className="w-full h-[80vh] border-0" title={t("preview.publish")} />
      </div>
    </div>
  );
}
