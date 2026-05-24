"use client";

import { useResumeStore } from "@/store/resume-store";
import { SectionCard } from "../SectionCard";
import { MediaAttachment } from "../MediaAttachment";
import { usePolishSection } from "../usePolishSection";
import { t } from "@/i18n";

export function BasicsSection() {
  const basics = useResumeStore((s) => s.data.basics);
  const update = useResumeStore((s) => s.updateBasics);
  const addMedia = useResumeStore((s) => s.addMedia);
  const removeMedia = useResumeStore((s) => s.removeMedia);
  const { polish, polishing, polishError } = usePolishSection("basics");

  type StringField = "name" | "title" | "email" | "phone" | "location" | "website" | "summary";
  const fields: { key: StringField; label: string; type?: string; rows?: number; hint?: string }[] = [
    { key: "name", label: t("edit.form.name") },
    { key: "title", label: t("edit.form.title"), hint: "一句话说明你是谁、做什么" },
    { key: "email", label: t("edit.form.email"), type: "email" },
    { key: "phone", label: t("edit.form.phone") },
    { key: "location", label: t("edit.form.location") },
    { key: "website", label: t("edit.form.website") },
    { key: "summary", label: t("edit.form.summary"), rows: 4, hint: "2-4 句个人品牌陈述：我是谁 → 做过什么 → 带来什么价值" },
  ];

  const handlePolish = async () => {
    const text = `姓名: ${basics.name}\n头衔: ${basics.title}\n简介: ${basics.summary}`;
    const result = await polish(text);
    if (!result) return;

    const titleMatch = result.match(/头衔[：:]\s*(.+)/);
    const summaryMatch = result.match(/简介[：:]\s*([\s\S]+)/);
    if (titleMatch) update("title", titleMatch[1].trim());
    if (summaryMatch) update("summary", summaryMatch[1].trim());
  };

  const preview = (
    <div className="space-y-4">
      <div className="flex items-start gap-5">
        {(basics.media || []).length > 0 && basics.media![0].type === "image" && (
          <img src={basics.media![0].url} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-neutral-200" />
        )}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{basics.name || t("edit.form.name")}</h2>
          <p className="text-lg text-neutral-500">{basics.title || t("edit.form.title")}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-neutral-400">
            {basics.email && <span>📧 {basics.email}</span>}
            {basics.phone && <span>📱 {basics.phone}</span>}
            {basics.location && <span>📍 {basics.location}</span>}
          </div>
        </div>
      </div>
      {basics.summary && <p className="text-neutral-600 leading-relaxed">{basics.summary}</p>}
    </div>
  );

  return (
    <SectionCard title={t("edit.form.basics")} section="basics" onPolish={handlePolish} polishing={polishing} polishError={polishError} preview={preview}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, type, rows, hint }) => (
          <div key={key} className={key === "summary" ? "sm:col-span-2" : ""}>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5">{label}</label>
            {rows ? (
              <textarea
                value={basics[key]}
                onChange={(e) => update(key, e.target.value)}
                rows={rows}
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-y"
              />
            ) : (
              <input
                type={type || "text"}
                value={basics[key]}
                onChange={(e) => update(key, e.target.value)}
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
              />
            )}
            {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
          </div>
        ))}
      </div>

      {/* Avatar / header image */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-neutral-600 mb-1.5">{t("edit.photo.label")}</label>
        <MediaAttachment
          media={basics.media || []}
          onAdd={(item) => addMedia("basics", "", item)}
          onRemove={(id) => removeMedia("basics", "", id)}
        />
      </div>
    </SectionCard>
  );
}
