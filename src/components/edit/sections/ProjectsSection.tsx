"use client";

import { useResumeStore } from "@/store/resume-store";
import { SectionCard } from "../SectionCard";
import { MediaAttachment } from "../MediaAttachment";
import { usePolishSection } from "../usePolishSection";
import { t } from "@/i18n";

export function ProjectsSection() {
  const projects = useResumeStore((s) => s.data.projects);
  const add = useResumeStore((s) => s.addProject);
  const remove = useResumeStore((s) => s.removeProject);
  const update = useResumeStore((s) => s.updateProject);
  const addMedia = useResumeStore((s) => s.addMedia);
  const removeMedia = useResumeStore((s) => s.removeMedia);
  const { polish, polishing, polishError } = usePolishSection("projects");

  const handlePolish = async (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const text = `项目: ${proj.name}\n描述: ${proj.description}\n亮点: ${proj.highlights.join(", ")}`;
    const result = await polish(text);
    if (!result) return;
    // Simple heuristic: first line is name, rest is description+highlights
    const lines = result.split("\n").filter(Boolean);
    if (lines.length >= 1) update(projId, "name", lines[0].replace(/^[^a-zA-Z一-鿿]+/, "").trim());
    if (lines.length >= 2) update(projId, "description", lines[1].trim());
    if (lines.length > 2) update(projId, "highlights", lines.slice(2).map((l: string) => l.replace(/^[•\-\*]\s*/, "").trim()));
  };

  const preview = (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((proj) => (
        <div key={proj.id} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
          <h4 className="font-semibold text-neutral-800">
            {proj.name || t("edit.form.projectName")}
            {proj.url && <a href={proj.url} className="ml-2 text-xs text-teal-500 hover:underline" target="_blank" rel="noopener">↗</a>}
          </h4>
          <p className="text-sm text-neutral-500 mt-1">{proj.description}</p>
          {proj.highlights.length > 0 && (
            <ul className="mt-2 space-y-0.5">
              {proj.highlights.map((h, i) => <li key={i} className="text-xs text-neutral-500 flex gap-1.5"><span className="text-teal-400">▸</span>{h}</li>)}
            </ul>
          )}
          {(proj.media || []).length > 0 && (
            <div className="flex gap-1 mt-2">
              {(proj.media || []).slice(0, 3).map((m) => (
                <div key={m.id} className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                  {m.type === "image" ? <img src={m.url} alt="" className="w-full h-full object-cover" /> : <span className="text-xs">▶</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <SectionCard title={t("edit.form.projects")} section="projects" preview={projects.length > 0 ? preview : undefined}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-400">{t("edit.form.projectDesc")}</p>
        <button onClick={add} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors">
          + {t("edit.form.add")}
        </button>
      </div>
      {projects.length === 0 && (
        <p className="text-sm text-neutral-400 py-8 text-center border-2 border-dashed rounded-xl">{t("edit.form.projectDesc")}</p>
      )}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div key={proj.id} className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/30 hover:border-neutral-300 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{t("edit.form.projectName")}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handlePolish(proj.id)} disabled={polishing} className="text-xs text-teal-500 hover:text-teal-700 px-2 py-0.5 rounded hover:bg-teal-50">✨</button>
                <button onClick={() => remove(proj.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-0.5 rounded hover:bg-red-50">{t("edit.form.remove")}</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input value={proj.name} onChange={(e) => update(proj.id, "name", e.target.value)} placeholder={t("edit.form.projectName")} className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
              <input value={proj.url} onChange={(e) => update(proj.id, "url", e.target.value)} placeholder={t("edit.form.projectUrl")} className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
            </div>
            <textarea value={proj.description} onChange={(e) => update(proj.id, "description", e.target.value)} placeholder={t("edit.form.projectDesc")} rows={2} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-y mb-3" />
            <textarea value={proj.highlights.join("\n")} onChange={(e) => update(proj.id, "highlights", e.target.value.split("\n").filter(Boolean))} placeholder="亮点 · 每行一条，动词开头量化成果" rows={3} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-y" />
            <MediaAttachment
              media={proj.media || []}
              onAdd={(item) => addMedia("projects", proj.id, item)}
              onRemove={(id) => removeMedia("projects", proj.id, id)}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
