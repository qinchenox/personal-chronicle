"use client";

import { useRef, useState, useCallback } from "react";
import { useResumeStore } from "@/store/resume-store";
import { THEMES, DEFAULT_THEME_ID, ThemeConfig } from "@/lib/themes";

function getTheme(themeId: string): ThemeConfig {
  return THEMES[themeId] || THEMES[DEFAULT_THEME_ID];
}

function themeCSS(t: ThemeConfig): string {
  return `
:root {
  --accent: ${t.colors.accent};
  --accent-hover: ${t.colors.accentHover};
  --accent-light: ${t.colors.accentLight};
  --bg-primary: ${t.colors.bgPrimary};
  --bg-secondary: ${t.colors.bgSecondary};
  --text-primary: ${t.colors.textPrimary};
  --text-secondary: ${t.colors.textSecondary};
  --text-muted: ${t.colors.textMuted};
  --border: ${t.colors.border};
  --tag-bg: ${t.colors.tagBg};
  --tag-text: ${t.colors.tagText};
}`;
}

function buildPreviewHTML(data: import("@/lib/types").ResumeData): string {
  const t = getTheme(data.themeId);
  const { basics, skills, experience, education, projects } = data;
  const cssVars = themeCSS(t);

  const contactItems = [
    basics.email ? { value: basics.email, href: `mailto:${basics.email}` } : null,
    basics.phone ? { value: basics.phone, href: null } : null,
    basics.location ? { value: basics.location, href: null } : null,
    basics.website ? { value: basics.website.replace(/^https?:\/\//, ""), href: basics.website } : null,
  ].filter(Boolean);

  const contactHTML = contactItems.length > 0
    ? `<div style="display:flex;flex-wrap:wrap;column-gap:1.5rem;row-gap:0.25rem;font-size:14px;color:var(--text-muted);margin-bottom:0">${contactItems.map((c) => {
        if (c!.href) {
          return `<a href="${esc(c!.href)}" target="_blank" rel="noopener noreferrer" style="color:var(--text-muted);text-decoration:none;transition:color 0.15s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'">${esc(c!.value)}</a>`;
        }
        return `<span>${esc(c!.value)}</span>`;
      }).join("")}</div>`
    : "";

  const section = (title: string, content: string) => `
<section style="margin-bottom:4rem">
  <h2 style="font-size:1.5rem;font-weight:600;color:var(--text-primary);margin:0 0 1.5rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border)">${esc(title)}</h2>
  ${content}
</section>`;

  const skillsHTML = skills.length > 0 ? section("技能", skills.map((cat) => `
<div style="margin-bottom:1rem">
  <h3 style="font-size:0.875rem;font-weight:500;color:var(--text-secondary);margin:0 0 0.5rem">${esc(cat.category)}</h3>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
    ${cat.items.map((item) => `<span style="display:inline-block;border-radius:9999px;padding:0.25rem 0.75rem;background:var(--tag-bg);color:var(--tag-text);font-size:0.875rem">${esc(item)}</span>`).join("")}
  </div>
</div>`).join("")) : "";

  const experienceHTML = experience.length > 0 ? section("工作经历", experience.map((exp) => `
<div style="margin-bottom:2.5rem">
  <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;column-gap:1rem;margin-bottom:0.25rem">
    <h3 style="font-size:1.125rem;font-weight:600;color:var(--text-primary);margin:0">${esc(exp.position)} <span style="color:var(--text-muted);font-weight:400">@ ${esc(exp.company)}</span></h3>
    <span style="font-size:0.875rem;color:var(--text-muted)">${esc(exp.startDate)} — ${esc(exp.endDate)}</span>
  </div>
  ${exp.summary ? `<p style="font-size:0.875rem;color:var(--text-secondary);margin:0 0 0.5rem">${esc(exp.summary)}</p>` : ""}
  ${exp.highlights.length > 0 ? `<ul style="list-style:disc;padding-left:1.25rem;font-size:0.875rem;color:var(--text-secondary);margin:0">${exp.highlights.map((h) => `<li style="margin-bottom:0.25rem">${esc(h)}</li>`).join("")}</ul>` : ""}
</div>`).join("")) : "";

  const educationHTML = education.length > 0 ? section("教育", education.map((edu) => `
<div style="display:flex;justify-content:space-between;flex-wrap:wrap;column-gap:1rem;margin-bottom:1.5rem">
  <div>
    <h3 style="font-size:1.125rem;font-weight:600;color:var(--text-primary);margin:0">${esc(edu.institution)}</h3>
    <p style="font-size:0.875rem;color:var(--text-secondary);margin:0">${esc(edu.degree)}${edu.field ? ` · ${esc(edu.field)}` : ""}</p>
  </div>
  <span style="font-size:0.875rem;color:var(--text-muted)">${esc(edu.startDate)} — ${esc(edu.endDate)}</span>
</div>`).join("")) : "";

  const projectsHTML = projects.length > 0 ? section("项目", projects.map((proj) => `
<div style="margin-bottom:2rem">
  <h3 style="font-size:1.125rem;font-weight:600;color:var(--text-primary);margin:0">
    ${esc(proj.name)}
    ${proj.url ? `<a href="${esc(proj.url)}" target="_blank" rel="noopener noreferrer" style="font-size:0.875rem;color:var(--text-muted);text-decoration:none;margin-left:0.375rem">↗</a>` : ""}
  </h3>
  ${proj.description ? `<p style="font-size:0.875rem;color:var(--text-secondary);margin:0.25rem 0 0">${esc(proj.description)}</p>` : ""}
  ${proj.highlights.length > 0 ? `<ul style="list-style:disc;padding-left:1.25rem;font-size:0.875rem;color:var(--text-secondary);margin:0.5rem 0 0">${proj.highlights.map((h) => `<li style="margin-bottom:0.25rem">${esc(h)}</li>`).join("")}</ul>` : ""}
</div>`).join("")) : "";

  const aboutHTML = basics.summary ? section("关于", `<p style="font-size:1rem;line-height:1.625;color:var(--text-secondary);white-space:pre-line;margin:0">${esc(basics.summary)}</p>`) : "";

  const isSplit = t.layout === "split";

  const mainHTML = isSplit
    ? `<div style="max-width:42rem;padding:6rem 1.5rem;margin:0 auto;display:grid;grid-template-columns:1fr">
  <aside>
    <div style="position:sticky;top:2rem">
      <h1 style="font-size:2.25rem;font-weight:700;letter-spacing:-0.025em;color:var(--text-primary);margin:0 0 0.75rem">${esc(basics.name || "姓名")}</h1>
      <p style="font-size:1.25rem;color:var(--text-secondary);margin:0 0 1rem">${esc(basics.title)}</p>
      ${contactHTML}
      <div style="margin-top:2rem;border-top:1px solid var(--border);padding-top:2rem">${skillsHTML.replace('style="margin-bottom:4rem"', 'style="margin-bottom:2rem"')}</div>
    </div>
  </aside>
  <main style="grid-column:span 2">
    ${aboutHTML}
    ${experienceHTML}
    ${educationHTML}
    ${projectsHTML}
  </main>
</div>`
    : `<main style="max-width:720px;margin:0 auto;padding:6rem 1.5rem">
  <header style="margin-bottom:4rem">
    <h1 style="font-size:2.25rem;font-weight:700;letter-spacing:-0.025em;color:var(--text-primary);margin:0 0 0.75rem">${esc(basics.name || "姓名")}</h1>
    <p style="font-size:1.25rem;color:var(--text-secondary);margin:0 0 1rem">${esc(basics.title)}</p>
    ${contactHTML}
  </header>
  ${aboutHTML}
  ${experienceHTML}
  ${educationHTML}
  ${skillsHTML}
  ${projectsHTML}
</main>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
${cssVars}
body{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;margin:0;padding:0;background:var(--bg-primary);color:var(--text-primary);-webkit-font-smoothing:antialiased}
h1,h2,h3,p{margin:0}a{color:inherit;text-decoration:none}ul{margin:0}
</style>
</head>
<body>
  ${mainHTML}
  <footer style="margin-top:6rem;padding-top:2rem;border-top:1px solid var(--border);text-align:center;font-size:0.875rem;color:var(--text-muted)">Made with 个人简史 · ${esc(t.name)}主题</footer>
</body>
</html>`;
}

function esc(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

export function PortfolioPreview() {
  const data = useResumeStore((s) => s.data);
  const [copyText, setCopyText] = useState("复制 HTML");
  const [downloading, setDownloading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  const downloadHTML = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/generate-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { alert("生成失败，请重试。"); setDownloading(false); return; }
      const html = await res.text();
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.basics.name || "个人主页"}-个人主页.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { alert("下载失败，请检查网络连接。"); }
    setDownloading(false);
  }, [data]);

  const copyHTML = useCallback(async () => {
    try {
      const res = await fetch("/api/generate-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { alert("生成失败，请重试。"); return; }
      const html = await res.text();
      await navigator.clipboard.writeText(html);
      setCopyText("已复制！");
      setTimeout(() => setCopyText("复制 HTML"), 2000);
    } catch { alert("复制失败。"); }
  }, [data]);

  const deploy = useCallback(async () => {
    setDeploying(true);
    setDeployError(null);
    setDeployUrl(null);
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setDeployError(json.error || "部署失败");
        setDeploying(false);
        return;
      }
      setDeployUrl(json.url);
    } catch { setDeployError("网络错误，部署失败。"); }
    setDeploying(false);
  }, [data]);

  const previewHTML = buildPreviewHTML(data);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-neutral-800">预览与发布</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={copyHTML} className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">
            {copyText}
          </button>
          <button onClick={downloadHTML} disabled={downloading} className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors">
            {downloading ? "生成中..." : "下载 HTML"}
          </button>
          <button onClick={deploy} disabled={deploying} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
            {deploying ? "部署中..." : "🔗 发布上线"}
          </button>
        </div>
      </div>

      {deployUrl && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 mb-2">发布成功！任何人都可通过以下链接访问你的个人主页：</p>
          <div className="flex gap-2 items-center">
            <input readOnly value={deployUrl} className="flex-1 px-3 py-1.5 text-sm border border-green-200 rounded bg-white text-green-800" onClick={(e) => (e.target as HTMLInputElement).select()} />
            <button onClick={() => { navigator.clipboard.writeText(deployUrl); alert("链接已复制！"); }} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700">
              复制
            </button>
            <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-sm bg-neutral-800 text-white rounded hover:bg-neutral-700">
              打开 ↗
            </a>
          </div>
        </div>
      )}
      {deployError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{deployError}</div>
      )}

      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <iframe srcDoc={previewHTML} className="w-full h-[80vh] border-0" title="个人主页预览" />
      </div>
    </div>
  );
}
