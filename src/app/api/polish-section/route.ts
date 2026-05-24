import { NextRequest, NextResponse } from "next/server";
import { serverT } from "@/i18n/server";

const CLAUDE_URL = process.env.LLM_BASE_URL || "https://api.anthropic.com";
const CLAUDE_KEY = process.env.ANTHROPIC_API_KEY || "";
const CLAUDE_MODEL = process.env.LLM_MODEL || "claude-sonnet-4-6";

const POLISH_PROMPTS: Record<string, string> = {
  summary: `你是一位资深简历优化专家。请润色以下个人简介，使其更具品牌感、更生动有力。保持 2-4 句的篇幅。只返回润色后的文本，不要加引号或解释。`,
  skills: `你是一位技术猎头。请优化以下技能列表：保持原有技能，根据行业惯例补充 2-3 项可能遗漏的关键技能，统一分类逻辑。返回格式：每行一个"类别：技能1, 技能2, 技能3"`,
  experience: `你是一位简历优化专家。请改写以下工作经历，使之更有说服力——用动词开头、量化成果。保持原有结构（公司/职位/日期不变），只优化摘要和亮点。返回简洁版本。`,
  education: `你是一位学术简历专家。请优化以下教育经历描述，使其更专业、更有学术感。`,
  projects: `你是一位技术项目经理。请优化以下项目描述：突出技术选型、量化成果、业务影响。返回优化后的项目名称、描述和亮点。`,
  basics: `你是一位职业顾问。请优化以下基本信息：职位头衔更具品牌感，个人网站/联系方式格式标准化。返回"字段名: 优化后内容"格式。`,
};

export async function POST(request: NextRequest) {
  try {
    const { section, content, locale } = await request.json();
    const loc = locale || (request.headers.get("x-locale") || "zh");

    if (!section || !content) {
      return NextResponse.json({ error: "Missing section or content" }, { status: 400 });
    }

    const promptKey = POLISH_PROMPTS[section] || serverT("prompts.sharedOutputFormat", loc as "zh" | "en");
    const systemPrompt = loc === "en"
      ? `${promptKey}\n\nIMPORTANT: Respond in English. Return only the polished result, no explanations.`
      : `${promptKey}\n\n只返回润色后的结果，不要加引号或解释。`;

    // Use OpenAI-compatible format (works with DashScope, Anthropic, and other providers)
    const response = await fetch(`${CLAUDE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLAUDE_KEY}`,
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `请优化以下内容：\n\n${content}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Polish API error:", response.status, errText);
      return NextResponse.json({ error: "AI 服务暂时不可用" }, { status: 502 });
    }

    const json = await response.json() as { choices: Array<{ message: { content: string } }> };
    const polished = json.choices?.[0]?.message?.content || "";

    return NextResponse.json({ success: true, polished: polished.trim() });
  } catch (error) {
    console.error("Polish section error:", error);
    return NextResponse.json({ error: "润色失败" }, { status: 500 });
  }
}
