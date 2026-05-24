"use client";

import { useState } from "react";
import { t } from "@/i18n";

interface Props {
  title: string;
  section: string;
  children: React.ReactNode;
  preview?: React.ReactNode;
  onPolish?: () => void;
  polishing?: boolean;
  polishError?: string;
}

export function SectionCard({ title, children, preview, onPolish, polishing, polishError }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-neutral-50/50 border-b border-neutral-100">
        <h3 className="text-base font-semibold text-neutral-800 flex-1">{title}</h3>

        <div className="flex items-center gap-1">
          {/* AI polish button */}
          {onPolish && (
            <button
              type="button"
              onClick={onPolish}
              disabled={polishing}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
                bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border border-teal-200
                hover:from-teal-100 hover:to-emerald-100 hover:border-teal-300
                disabled:opacity-50 disabled:cursor-wait"
              title={t("edit.sectionCard.aiPolish")}
            >
              {polishing ? (
                <>
                  <span className="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                  {t("edit.sectionCard.polishing")}
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  {t("edit.sectionCard.polish")}
                </>
              )}
            </button>
          )}

          {/* Preview toggle */}
          {preview && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
                ${showPreview
                  ? "bg-neutral-100 text-neutral-700"
                  : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"}`}
              title={showPreview ? t("edit.sectionCard.editMode") : t("edit.sectionCard.previewMode")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {showPreview
                  ? <><path d="M17 1l4 4-4 4"/><path d="M3 11V3h8"/><path d="M7 23H3v-8"/><path d="M21 13v8h-8"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
              </svg>
              {showPreview ? t("edit.sectionCard.editMode") : t("edit.sectionCard.previewMode")}
            </button>
          )}
        </div>
      </div>

      {/* Polish error */}
      {polishError && (
        <div className="mx-6 mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{polishError}</div>
      )}

      {/* Content */}
      <div className="p-6">
        {showPreview && preview ? preview : children}
      </div>
    </section>
  );
}
