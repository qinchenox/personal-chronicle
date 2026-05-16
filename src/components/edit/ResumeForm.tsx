"use client";

import { useRouter } from "next/navigation";
import { BasicsSection } from "./sections/BasicsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { useResumeStore } from "@/store/resume-store";
import { THEMES, DEFAULT_THEME_ID } from "@/lib/themes";

function ThemeSelector() {
  const themeId = useResumeStore((s) => s.data.themeId);
  const setTheme = useResumeStore((s) => s.setTheme);

  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-neutral-800">风格主题</h3>
      <p className="text-sm text-neutral-400">AI 根据岗位自动匹配，也可手动切换</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Object.values(THEMES).map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`text-left p-3 rounded-lg border-2 transition-all text-sm ${
              themeId === t.id
                ? "border-neutral-800 bg-neutral-50"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: t.colors.accent }}
              />
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: t.colors.bgPrimary, border: "1px solid #e5e5e5" }}
              />
            </div>
            <span className="font-medium text-neutral-800">{t.name}</span>
            <span className="block text-xs text-neutral-400 mt-0.5">{t.description.slice(0, 20)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function ResumeForm() {
  const router = useRouter();
  const reset = useResumeStore((s) => s.reset);
  const hasData = useResumeStore((s) => s.data.basics.name !== "");

  if (!hasData) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-lg text-neutral-500 mb-4">尚未上传简历或解析数据为空。</p>
        <button
          onClick={() => router.push("/")}
          className="text-accent hover:underline"
        >
          返回上传简历
        </button>
        <p className="text-sm text-neutral-400 mt-4">也可手动填写以下信息创建个人主页。</p>
        <div className="mt-8">
          <FormContent />
        </div>
      </div>
    );
  }

  return <FormContent />;
}

function FormContent() {
  const router = useRouter();
  const reset = useResumeStore((s) => s.reset);
  const warnings = useResumeStore((s) => s.warnings);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">编辑简历信息</h2>
          <p className="text-sm text-neutral-400 mt-1">
            AI 解析结果可能有误，请检查并修正以下信息。
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="text-sm text-neutral-400 hover:text-red-500 transition-colors"
          >
            清空重填
          </button>
          <button
            onClick={() => router.push("/preview")}
            className="px-4 py-2 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            预览主页
          </button>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          {warnings.map((w, i) => (
            <p key={i} className="text-sm text-yellow-700">{w}</p>
          ))}
        </div>
      )}

      <div className="space-y-10">
        <ThemeSelector />
        <hr className="border-neutral-200" />
        <BasicsSection />
        <hr className="border-neutral-200" />
        <ExperienceSection />
        <hr className="border-neutral-200" />
        <EducationSection />
        <hr className="border-neutral-200" />
        <SkillsSection />
        <hr className="border-neutral-200" />
        <ProjectsSection />
      </div>

      <div className="mt-10 pb-16 flex justify-end">
        <button
          onClick={() => router.push("/preview")}
          className="px-6 py-3 bg-[#0a0a0a] text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          预览生成结果
        </button>
      </div>
    </div>
  );
}
