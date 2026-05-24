import { NextRequest, NextResponse } from "next/server";
import { generatePortfolioHTML } from "@/lib/html-generator";
import { ResumeData } from "@/lib/types";
import { resumeDataSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resumeDataSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "无效的简历数据", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const html = generatePortfolioHTML(parsed.data as unknown as ResumeData);
    const name = parsed.data.basics.name || "个人主页";
    const safeName = encodeURIComponent(`${name}-个人主页.html`);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename*=UTF-8''${safeName}`,
      },
    });
  } catch (error) {
    console.error("Generate HTML error:", error);
    return NextResponse.json(
      { error: "HTML 生成失败，请稍后重试。" },
      { status: 500 }
    );
  }
}
