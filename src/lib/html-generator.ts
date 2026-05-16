import "server-only";
import { ResumeData } from "./types";
import { TEMPLATE_CSS } from "./template-css";
import { THEMES, DEFAULT_THEME_ID, ThemeConfig } from "./themes";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTheme(data: ResumeData): ThemeConfig {
  return THEMES[data.themeId] || THEMES[DEFAULT_THEME_ID];
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

function renderPortfolioHTML(data: ResumeData): string {
  const t = getTheme(data);
  const { basics, skills, experience, education, projects } = data;
  const cssVars = themeCSS(t);

  const contactItems = [
    basics.email ? { type: "email", value: basics.email, href: `mailto:${basics.email}` } : null,
    basics.phone ? { type: "text", value: basics.phone, href: null } : null,
    basics.location ? { type: "text", value: basics.location, href: null } : null,
    basics.website ? { type: "link", value: basics.website.replace(/^https?:\/\//, ""), href: basics.website } : null,
  ].filter(Boolean);

  const contactHTML = contactItems.length > 0
    ? `<div class="flex flex-wrap gap-x-6 gap-y-1 text-sm" style="color:var(--text-muted)">${contactItems.map((c) => {
        if (c!.href) {
          return `<a href="${esc(c!.href)}" target="_blank" rel="noopener noreferrer" class="hover-accent transition-colors">${esc(c!.value)}</a>`;
        }
        return `<span>${esc(c!.value)}</span>`;
      }).join("")}</div>`
    : "";

  // Section helper
  const section = (title: string, content: string) => `
<section class="mb-16">
  <h2 class="text-2xl font-semibold mb-6 pb-2 border-b" style="color:var(--text-primary);border-color:var(--border)">${esc(title)}</h2>
  ${content}
</section>`;

  // Skills
  const skillsHTML = skills.length > 0 ? section("技能", skills.map((cat) => `
<div style="margin-bottom:16px">
  <h3 class="text-sm font-medium mb-2" style="color:var(--text-secondary)">${esc(cat.category)}</h3>
  <div class="flex flex-wrap gap-2">
    ${cat.items.map((item) => `<span class="tag-pill">${esc(item)}</span>`).join("")}
  </div>
</div>`).join("")) : "";

  // Experience
  const experienceHTML = experience.length > 0 ? section("工作经历", experience.map((exp) => `
<div class="mb-10">
  <div class="flex justify-between items-baseline flex-wrap gap-x-4 mb-1">
    <h3 class="text-lg font-semibold" style="color:var(--text-primary)">${esc(exp.position)} <span style="color:var(--text-muted);font-weight:400">@ ${esc(exp.company)}</span></h3>
    <span class="text-sm whitespace-nowrap" style="color:var(--text-muted)">${esc(exp.startDate)} — ${esc(exp.endDate)}</span>
  </div>
  ${exp.summary ? `<p class="text-sm mb-2" style="color:var(--text-secondary)">${esc(exp.summary)}</p>` : ""}
  ${exp.highlights.length > 0 ? `<ul class="list-disc list-inside text-sm space-y-1" style="color:var(--text-secondary)">${exp.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
</div>`).join("")) : "";

  // Education
  const educationHTML = education.length > 0 ? section("教育", education.map((edu) => `
<div class="flex justify-between flex-wrap gap-x-4 mb-6">
  <div>
    <h3 class="text-lg font-semibold" style="color:var(--text-primary)">${esc(edu.institution)}</h3>
    <p class="text-sm" style="color:var(--text-secondary)">${esc(edu.degree)}${edu.field ? ` · ${esc(edu.field)}` : ""}</p>
  </div>
  <span class="text-sm whitespace-nowrap" style="color:var(--text-muted)">${esc(edu.startDate)} — ${esc(edu.endDate)}</span>
</div>`).join("")) : "";

  // Projects
  const projectsHTML = projects.length > 0 ? section("项目", projects.map((proj) => `
<div class="mb-8">
  <h3 class="text-lg font-semibold" style="color:var(--text-primary)">
    ${esc(proj.name)}
    ${proj.url ? `<a href="${esc(proj.url)}" target="_blank" rel="noopener noreferrer" class="ml-2 text-sm font-normal" style="color:var(--text-muted)">↗</a>` : ""}
  </h3>
  ${proj.description ? `<p class="text-sm mt-1" style="color:var(--text-secondary)">${esc(proj.description)}</p>` : ""}
  ${proj.highlights.length > 0 ? `<ul class="list-disc list-inside text-sm mt-2 space-y-1" style="color:var(--text-secondary)">${proj.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
</div>`).join("")) : "";

  // About
  const aboutHTML = basics.summary ? section("关于", `<p class="text-base leading-relaxed whitespace-pre-line" style="color:var(--text-secondary)">${esc(basics.summary)}</p>`) : "";

  // Layout classes based on theme
  const isSplit = t.layout === "split";
  const mainClasses = isSplit
    ? "max-w-2xl px-6 py-16 sm:py-24 grid grid-cols-1 md:grid-cols-3 gap-12"
    : "max-w-[720px] px-6 py-16 sm:py-24 mx-auto";

  const sidebarHTML = isSplit
    ? `<aside>
  <div class="sticky-t" style="top:2rem">
    <div class="text-4xl font-bold tracking-tight mb-3" style="color:var(--text-primary)">${esc(basics.name || "姓名")}</div>
    <div class="text-xl mb-4" style="color:var(--text-secondary)">${esc(basics.title)}</div>
    ${contactHTML}
    <div class="mt-8" style="border-top:1px solid var(--border);padding-top:2rem">${skillsHTML.replace('class="mb-16"', 'class="mb-8"')}</div>
  </div>
</aside>
<main style="grid-column: span 2">
  ${aboutHTML}
  ${experienceHTML}
  ${educationHTML}
  ${projectsHTML}
</main>`
    : `<main class="${mainClasses}">
<header class="mb-16">
  <h1 class="text-4xl font-bold tracking-tight mb-3" style="color:var(--text-primary)">${esc(basics.name || "姓名")}</h1>
  <p class="text-xl mb-4" style="color:var(--text-secondary)">${esc(basics.title)}</p>
  ${contactHTML}
</header>
${aboutHTML}
${experienceHTML}
${educationHTML}
${skillsHTML}
${projectsHTML}
</main>`;

  return `${cssVars}
${sidebarHTML}
<footer class="mt-24 pt-8 border-t text-center text-sm" style="color:var(--text-muted);border-color:var(--border);${isSplit ? 'max-w-2xl mx-auto px-6' : ''}">Made with 个人简史 · ${esc(t.name)}主题</footer>`;
}

export function generatePortfolioHTML(data: ResumeData): string {
  const t = getTheme(data);
  const bodyHTML = renderPortfolioHTML(data);
  const fullName = esc(data.basics.name || "个人主页");
  const description = esc(data.basics.summary || data.basics.title || "个人介绍");
  const title = esc(data.basics.title || "");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — ${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${fullName}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <style>
    *,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}
    html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4}
    body{line-height:inherit;margin:0;padding:0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;-webkit-font-smoothing:antialiased;background:var(--bg-primary);color:var(--text-primary)}
    h1,h2,h3,p{margin:0}
    a{color:inherit;text-decoration:none}
    ul{margin:0}
    .mb-1{margin-bottom:.25rem}.mb-16{margin-bottom:4rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.mb-10{margin-bottom:2.5rem}.mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.mt-8{margin-top:2rem}.mt-24{margin-top:6rem}
    .flex{display:flex}.grid{display:grid}.list-inside{list-style-position:inside}.list-disc{list-style-type:disc}.flex-wrap{flex-wrap:wrap}.items-baseline{align-items:baseline}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.gap-x-4{column-gap:1rem}.gap-x-6{column-gap:1.5rem}.gap-y-1{row-gap:.25rem}.gap-12{gap:3rem}.space-y-1>:not([hidden])~:not([hidden]){margin-top:.25rem}
    .whitespace-nowrap{white-space:nowrap}.whitespace-pre-line{white-space:pre-line}
    .text-2xl{font-size:1.5rem;line-height:2rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}
    .font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}
    .tracking-tight{letter-spacing:-.025em}.leading-relaxed{line-height:1.625}
    .px-3{padding-left:.75rem;padding-right:.75rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-16{padding-top:4rem;padding-bottom:4rem}.pb-2{padding-bottom:.5rem}.pt-8{padding-top:2rem}
    .text-center{text-align:center}
    .rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}
    .border-b{border-bottom-width:1px}.border-t{border-top-width:1px}
    .transition-colors{transition:color .15s}
    .hover-accent:hover{color:var(--accent)}
    .tag-pill{display:inline-block;border-radius:9999px;padding:.25rem .75rem;background:var(--tag-bg);color:var(--tag-text);font-size:.875rem;line-height:1.25rem}
    .grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
    .sticky-t{position:sticky}
    .mx-auto{margin-left:auto;margin-right:auto}
    .max-w-2xl{max-width:42rem}.max-w-\\[720px\\]{max-width:720px}
    @media(min-width:640px){.sm\\:py-24{padding-top:6rem;padding-bottom:6rem}}
    @media(min-width:768px){.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}
  </style>
</head>
<body>
  ${bodyHTML}
</body>
</html>`;
}

export function generatePreviewHTML(data: ResumeData): string {
  const bodyHTML = renderPortfolioHTML(data);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    *,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}
    html{line-height:1.5;-webkit-text-size-adjust:100%}
    body{line-height:inherit;margin:0;padding:0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;-webkit-font-smoothing:antialiased;background:var(--bg-primary);color:var(--text-primary)}
    h1,h2,h3,p{margin:0}a{color:inherit;text-decoration:none}ul{margin:0}
    .mb-1{margin-bottom:.25rem}.mb-16{margin-bottom:4rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.mb-10{margin-bottom:2.5rem}.mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.mt-8{margin-top:2rem}.mt-24{margin-top:6rem}
    .flex{display:flex}.grid{display:grid}.list-inside{list-style-position:inside}.list-disc{list-style-type:disc}.flex-wrap{flex-wrap:wrap}.items-baseline{align-items:baseline}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.gap-x-4{column-gap:1rem}.gap-x-6{column-gap:1.5rem}.gap-y-1{row-gap:.25rem}.gap-12{gap:3rem}.space-y-1>:not([hidden])~:not([hidden]){margin-top:.25rem}
    .whitespace-nowrap{white-space:nowrap}.whitespace-pre-line{white-space:pre-line}
    .text-2xl{font-size:1.5rem;line-height:2rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}
    .font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}
    .tracking-tight{letter-spacing:-.025em}.leading-relaxed{line-height:1.625}
    .px-3{padding-left:.75rem;padding-right:.75rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-16{padding-top:4rem;padding-bottom:4rem}.pb-2{padding-bottom:.5rem}.pt-8{padding-top:2rem}
    .text-center{text-align:center}.rounded-full{border-radius:9999px}.border-b{border-bottom-width:1px}.border-t{border-top-width:1px}
    .transition-colors{transition:color .15s}
    .hover-accent:hover{color:var(--accent)}
    .tag-pill{display:inline-block;border-radius:9999px;padding:.25rem .75rem;background:var(--tag-bg);color:var(--tag-text);font-size:.875rem;line-height:1.25rem}
    .grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.sticky-t{position:sticky}.mx-auto{margin-left:auto;margin-right:auto}
    .max-w-2xl{max-width:42rem}.max-w-\\[720px\\]{max-width:720px}
    @media(min-width:640px){.sm\\:py-24{padding-top:6rem;padding-bottom:6rem}}
    @media(min-width:768px){.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}
  </style>
</head>
<body>
  ${bodyHTML}
</body>
</html>`;
}
