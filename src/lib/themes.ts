export interface ThemeColors {
  // 主色调
  accent: string;
  accentHover: string;
  accentLight: string;
  // 背景
  bgPrimary: string;
  bgSecondary: string;
  // 文字
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // 边框
  border: string;
  // 标签/徽章
  tagBg: string;
  tagText: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  // 布局倾向
  layout: "split" | "centered" | "sidebar";
  // 字体偏好
  fontPairing: "sans" | "serif-heading" | "mono-accent";
  // 卡片圆角
  radius: "sharp" | "rounded" | "pill";
  // 暗色/亮色模式
  mode: "light" | "dark";
}

// 行业关键词 → 主题 ID 映射
export const INDUSTRY_THEME_MAP: Record<string, string> = {
  // 科技/互联网
  "技术": "tech-dark",
  "开发": "tech-dark",
  "软件": "tech-dark",
  "工程师": "tech-dark",
  "前端": "tech-dark",
  "后端": "tech-dark",
  "全栈": "tech-dark",
  "程序员": "tech-dark",
  "IT": "tech-dark",
  "互联网": "tech-dark",
  "AI": "tech-ai",
  "人工智能": "tech-ai",
  "机器学习": "tech-ai",
  "数据": "tech-ai",
  "算法": "tech-ai",

  // 设计/创意
  "设计": "creative",
  "UI": "creative",
  "UX": "creative",
  "创意": "creative",
  "视觉": "creative",
  "品牌": "creative",
  "艺术": "creative",
  "多媒体": "creative",
  "视频": "creative",

  // 金融/商业
  "金融": "finance",
  "银行": "finance",
  "证券": "finance",
  "投资": "finance",
  "会计": "finance",
  "财务": "finance",
  "保险": "finance",
  "商业": "professional",
  "管理": "professional",
  "咨询": "professional",
  "顾问": "professional",
  "行政": "professional",
  "HR": "professional",
  "人力资源": "professional",
  "法务": "professional",
  "法律": "professional",
  "律师": "professional",

  // 教育/学术
  "教育": "education",
  "教师": "education",
  "教授": "education",
  "讲师": "education",
  "培训": "education",
  "学术": "education",
  "研究": "education",
  "科研": "education",

  // 医疗/健康
  "医疗": "healthcare",
  "医生": "healthcare",
  "护士": "healthcare",
  "健康": "healthcare",
  "医药": "healthcare",
  "护理": "healthcare",

  // 销售/市场
  "销售": "sales",
  "市场": "sales",
  "营销": "sales",
  "运营": "sales",
  "电商": "sales",
  "商务": "sales",
  "客户": "sales",

  // 制造/工程
  "制造": "industrial",
  "工程": "industrial",
  "机械": "industrial",
  "建筑": "industrial",
  "电气": "industrial",
  "生产": "industrial",
  "质量": "industrial",

  // 媒体/传播
  "媒体": "media",
  "记者": "media",
  "编辑": "media",
  "传播": "media",
  "公关": "media",
  "广告": "media",
  "文案": "media",
};

export const THEMES: Record<string, ThemeConfig> = {
  "tech-dark": {
    id: "tech-dark",
    name: "科技暗色",
    description: "极客风格，深色背景配霓虹点缀，适合技术/开发岗位",
    colors: {
      accent: "#3b82f6",
      accentHover: "#2563eb",
      accentLight: "#dbeafe",
      bgPrimary: "#0f172a",
      bgSecondary: "#1e293b",
      textPrimary: "#f1f5f9",
      textSecondary: "#94a3b8",
      textMuted: "#64748b",
      border: "#334155",
      tagBg: "#1e293b",
      tagText: "#93c5fd",
    },
    layout: "centered",
    fontPairing: "mono-accent",
    radius: "rounded",
    mode: "dark",
  },

  "tech-light": {
    id: "tech-light",
    name: "科技亮色",
    description: "干净简洁，白底蓝调，适合通用技术岗位",
    colors: {
      accent: "#0066ff",
      accentHover: "#0052cc",
      accentLight: "#e6f0ff",
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      textMuted: "#94a3b8",
      border: "#e2e8f0",
      tagBg: "#f1f5f9",
      tagText: "#1e40af",
    },
    layout: "centered",
    fontPairing: "sans",
    radius: "rounded",
    mode: "light",
  },

  "tech-ai": {
    id: "tech-ai",
    name: "AI 智慧",
    description: "渐进紫调，数据感与现代感并存，适合 AI/数据科学岗位",
    colors: {
      accent: "#7c3aed",
      accentHover: "#6d28d9",
      accentLight: "#ede9fe",
      bgPrimary: "#0a0a0f",
      bgSecondary: "#1a1a2e",
      textPrimary: "#f0e6ff",
      textSecondary: "#a78bfa",
      textMuted: "#6d6d8a",
      border: "#2a2a3e",
      tagBg: "#1e1b4b",
      tagText: "#c4b5fd",
    },
    layout: "centered",
    fontPairing: "mono-accent",
    radius: "sharp",
    mode: "dark",
  },

  creative: {
    id: "creative",
    name: "创意设计",
    description: "大胆配色，视觉张力强，适合设计/创意类岗位",
    colors: {
      accent: "#ec4899",
      accentHover: "#db2777",
      accentLight: "#fce7f3",
      bgPrimary: "#fafafa",
      bgSecondary: "#f4f4f5",
      textPrimary: "#18181b",
      textSecondary: "#52525b",
      textMuted: "#a1a1aa",
      border: "#e4e4e7",
      tagBg: "#fce7f3",
      tagText: "#be185d",
    },
    layout: "split",
    fontPairing: "serif-heading",
    radius: "pill",
    mode: "light",
  },

  finance: {
    id: "finance",
    name: "金融经典",
    description: "沉稳专业，海军蓝配金色点缀，适合金融/投资岗位",
    colors: {
      accent: "#b8860b",
      accentHover: "#9a720c",
      accentLight: "#fef9c3",
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      textPrimary: "#1e293b",
      textSecondary: "#475569",
      textMuted: "#94a3b8",
      border: "#e2e8f0",
      tagBg: "#f1f5f9",
      tagText: "#92400e",
    },
    layout: "centered",
    fontPairing: "serif-heading",
    radius: "sharp",
    mode: "light",
  },

  professional: {
    id: "professional",
    name: "专业商务",
    description: "利落稳重，深灰与蓝色点缀，适合管理/咨询岗位",
    colors: {
      accent: "#1e40af",
      accentHover: "#1e3a8a",
      accentLight: "#dbeafe",
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      textPrimary: "#1e293b",
      textSecondary: "#475569",
      textMuted: "#94a3b8",
      border: "#e2e8f0",
      tagBg: "#f1f5f9",
      tagText: "#1e3a8a",
    },
    layout: "sidebar",
    fontPairing: "sans",
    radius: "sharp",
    mode: "light",
  },

  education: {
    id: "education",
    name: "学术教育",
    description: "温润亲和，暖棕配墨绿，适合教育/科研岗位",
    colors: {
      accent: "#0d9488",
      accentHover: "#0f766e",
      accentLight: "#ccfbf1",
      bgPrimary: "#fffbeb",
      bgSecondary: "#fef3c7",
      textPrimary: "#292524",
      textSecondary: "#57534e",
      textMuted: "#a8a29e",
      border: "#e7e5e4",
      tagBg: "#fef3c7",
      tagText: "#115e59",
    },
    layout: "centered",
    fontPairing: "serif-heading",
    radius: "rounded",
    mode: "light",
  },

  healthcare: {
    id: "healthcare",
    name: "医疗健康",
    description: "洁净安宁，浅蓝白色调，适合医疗/健康岗位",
    colors: {
      accent: "#0891b2",
      accentHover: "#0e7490",
      accentLight: "#ecfeff",
      bgPrimary: "#ffffff",
      bgSecondary: "#f0f9ff",
      textPrimary: "#164e63",
      textSecondary: "#0e7490",
      textMuted: "#67b8c9",
      border: "#cffafe",
      tagBg: "#ecfeff",
      tagText: "#155e75",
    },
    layout: "centered",
    fontPairing: "sans",
    radius: "rounded",
    mode: "light",
  },

  sales: {
    id: "sales",
    name: "活力商务",
    description: "热情洋溢，橙色点缀与暖灰背景，适合销售/市场岗位",
    colors: {
      accent: "#ea580c",
      accentHover: "#c2410c",
      accentLight: "#fff7ed",
      bgPrimary: "#ffffff",
      bgSecondary: "#fafaf9",
      textPrimary: "#292524",
      textSecondary: "#57534e",
      textMuted: "#a8a29e",
      border: "#e7e5e4",
      tagBg: "#fff7ed",
      tagText: "#9a3412",
    },
    layout: "split",
    fontPairing: "sans",
    radius: "rounded",
    mode: "light",
  },

  industrial: {
    id: "industrial",
    name: "工业工程",
    description: "稳重可靠，铁灰配橙色点缀，适合工程/制造岗位",
    colors: {
      accent: "#dc2626",
      accentHover: "#b91c1c",
      accentLight: "#fef2f2",
      bgPrimary: "#ffffff",
      bgSecondary: "#fafafa",
      textPrimary: "#1c1917",
      textSecondary: "#57534e",
      textMuted: "#a8a29e",
      border: "#e7e5e4",
      tagBg: "#fafaf9",
      tagText: "#7f1d1d",
    },
    layout: "centered",
    fontPairing: "sans",
    radius: "sharp",
    mode: "light",
  },

  media: {
    id: "media",
    name: "媒体传播",
    description: "醒目雅致，墨绿与暗红搭配，适合媒体/编辑岗位",
    colors: {
      accent: "#b91c1c",
      accentHover: "#991b1b",
      accentLight: "#fef2f2",
      bgPrimary: "#fefefe",
      bgSecondary: "#fafafa",
      textPrimary: "#1c1917",
      textSecondary: "#44403c",
      textMuted: "#a8a29e",
      border: "#e7e5e4",
      tagBg: "#fafaf9",
      tagText: "#7f1d1d",
    },
    layout: "split",
    fontPairing: "serif-heading",
    radius: "sharp",
    mode: "light",
  },
};

// 默认主题（无行业匹配时）
export const DEFAULT_THEME_ID = "tech-light";

export function detectTheme(title: string, summary: string, skills: string[]): string {
  const searchText = [title, summary, ...skills].join(" ").toLowerCase();

  let bestMatch = "";
  let bestScore = 0;

  for (const [keyword, themeId] of Object.entries(INDUSTRY_THEME_MAP)) {
    if (searchText.includes(keyword.toLowerCase())) {
      // 更长的关键词匹配得分更高
      const score = keyword.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = themeId;
      }
    }
  }

  return bestMatch || DEFAULT_THEME_ID;
}
