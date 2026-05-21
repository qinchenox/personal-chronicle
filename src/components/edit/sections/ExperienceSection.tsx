"use client";

import { useResumeStore } from "@/store/resume-store";
import { SectionCard } from "../SectionCard";
import { MediaAttachment } from "../MediaAttachment";
import { usePolishSection } from "../usePolishSection";
import { t } from "@/i18n";

export function ExperienceSection() {
  const experience = useResumeStore((s) => s.data.experience);
  const add = useResumeStore((s) => s.addExperience);
  const remove = useResumeStore((s) => s.removeExperience);
  const update = useResumeStore((s) => s.updateExperience);
  const addMedia = useResumeStore((s) => s.addMedia);
  const removeMedia = useResumeStore((s) => s.removeMedia);
  const { polish, polishing, polishError } = usePolishSection("experience");

  const handlePolish = async (expId: string) => {
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    const text = `公司: ${exp.company}\n职位: ${exp.position}\n描述: ${exp.summary}\n亮点: ${exp.highlights.join(", ")}`;
    const result = await polish(text);
    if (!result) return;
    const lines = result.split("\n").filter(Boolean);
    const summaryLine = lines.find((l: string) => l.length > 20 && !l.includes("："));
    const highlightLines = lines.filter((l: string) => /^[•\-\d]/.test(l));
    if (summaryLine) update(expId, "summary", summaryLine.replace(/^[•\-\d+.]\s*/, "").trim());
    if (highlightLines.length > 0) update(expId, "highlights", highlightLines.map((l: string) => l.replace(/^[•\-\d+.]\s*/, "").trim()));
  };

  const preview = (
    <div className="relative pl-6 border-l-2 border-teal-200 space-y-6">
      {experience.map((exp) => (
        <div key={exp.id} className="relative">
          <div className="absolute left-[-1.55rem] top-1 w-3 h-3 rounded-full bg-teal-400 border-2 border-white" />
          <h4 className="font-semibold text-neutral-800">{exp.position || t("edit.form.position")} <span className="text-neutral-400 font-normal">@ {exp.company || t("edit.form.company")}</span></h4>
          <p className="text-xs text-neutral-400 mt-0.5">{exp.startDate} — {exp.endDate || t("edit.form.present")}</p>
          <p className="text-sm text-neutral-600 mt-2">{exp.summary}</p>
          {exp.highlights.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {exp.highlights.map((h, i) => <li key={i} className="text-xs text-neutral-500 flex gap-1.5"><span className="text-teal-400">▸</span>{h}</li>)}
            </ul>
          )}
          {(exp.media || []).length > 0 && (
            <div className="flex gap-1 mt-2">
              {(exp.media || []).map((m) => (
                <div key={m.id} className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                  {m.type === "image" ? <img src={m.url} alt="" className="w-full h-full object-cover" /> : <span className="text-lg flex items-center justify-center h-full">▶</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <SectionCard title={t("edit.form.experience")} section="experience" preview={experience.length > 0 ? preview : undefined} onPolish={() => {}} polishing={polishing} polishError={polishError}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-400">{t("edit.form.experience")}</p>
        <button onClick={add} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors">
          + {t("edit.form.add")}
        </button>
      </div>
      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/30 hover:border-neutral-300 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{exp.position || t("edit.form.position")}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handlePolish(exp.id)} disabled={polishing} className="text-xs text-teal-500 hover:text-teal-700 px-2 py-0.5 rounded hover:bg-teal-50">✨</button>
                <button onClick={() => remove(exp.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-0.5 rounded hover:bg-red-50">{t("edit.form.remove")}</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input value={exp.company} onChange={(e) => update(exp.id, "company", e.target.value)} placeholder={t("edit.form.company")} className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
              <input value={exp.position} onChange={(e) => update(exp.id, "position", e.target.value)} placeholder={t("edit.form.position")} className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
              <input value={exp.startDate} onChange={(e) => update(exp.id, "startDate", e.target.value)} placeholder={t("edit.form.startDate")} className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
              <input value={exp.endDate} onChange={(e) => update(exp.id, "endDate", e.target.value)} placeholder={t("edit.form.endDate") + " (" + t("edit.form.present") + ")"} className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
            </div>
            <textarea value={exp.summary} onChange={(e) => update(exp.id, "summary", e.target.value)} placeholder={t("edit.form.jobSummary")} rows={2} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-y mb-3" />
            <textarea value={exp.highlights.join("\n")} onChange={(e) => update(exp.id, "highlights", e.target.value.split("\n").filter(Boolean))} placeholder={t("edit.form.highlights")} rows={3} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-y" />
            <MediaAttachment
              media={exp.media || []}
              onAdd={(item) => addMedia("experience", exp.id, item)}
              onRemove={(id) => removeMedia("experience", exp.id, id)}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
