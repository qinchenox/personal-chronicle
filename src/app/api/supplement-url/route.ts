import { NextRequest, NextResponse } from "next/server";
import { getMergePrompt } from "@/i18n/prompts";

const BASE_URL = process.env.LLM_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const API_KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.LLM_MODEL || "qwen-plus";
const MAX_TEXT_LENGTH = 8000;

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, currentData, agentId } = body as {
      url: string;
      currentData: string;
      agentId?: string;
    };

    if (!url || !currentData) {
      return NextResponse.json(
        { error: "缺少链接或当前简历数据" },
        { status: 400 }
      );
    }

    // Validate URL
    let parsed: URL;
    try {
      parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return NextResponse.json(
          { error: "仅支持 http/https 链接" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ error: "无效的链接地址" }, { status: 400 });
    }

    // Fetch URL content
    let fetchRes: Response;
    try {
      fetchRes = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; LifeJourney/1.0; +https://life-journey-omega.vercel.app)",
        },
      });
    } catch {
      return NextResponse.json(
        { error: "无法抓取该链接，请检查地址或手动粘贴文本" },
        { status: 502 }
      );
    }

    if (!fetchRes.ok) {
      return NextResponse.json(
        { error: `链接返回错误 (${fetchRes.status})，请检查地址是否正确` },
        { status: 502 }
      );
    }

    const contentType = fetchRes.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return NextResponse.json(
        { error: "仅支持网页链接（HTML），不支持文件下载链接" },
        { status: 400 }
      );
    }

    const raw = await fetchRes.text();
    const text = stripHtml(raw);

    if (text.length < 50) {
      return NextResponse.json(
        { error: "未提取到有效内容，该页面可能为空白或动态渲染页面" },
        { status: 502 }
      );
    }

    const truncated = text.slice(0, MAX_TEXT_LENGTH);

    // LLM merge
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          { role: "system", content: getMergePrompt() },
          {
            role: "user",
            content: `现有简历数据：\n${currentData}\n\n网页抓取内容（来自 ${url}）：\n${truncated}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "AI 合并服务暂时不可用" },
        { status: 502 }
      );
    }

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const result = json.choices?.[0]?.message?.content || "";
    const jsonMatch =
      result.match(/```(?:json)?\n?([\s\S]*?)\n?```/) ||
      result.match(/(\{[\s\S]*\})/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI 返回格式异常" },
        { status: 502 }
      );
    }

    const merged = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    return NextResponse.json({ success: true, data: merged });
  } catch (error) {
    console.error("Supplement URL error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
