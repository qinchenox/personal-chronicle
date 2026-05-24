import { NextRequest, NextResponse } from "next/server";
import { generatePortfolioHTML } from "@/lib/html-generator";
import { deployToVercel } from "@/lib/vercel-deploy";
import { resumeDataSchema } from "@/lib/validators";
import { ResumeData } from "@/lib/types";

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

    const data = parsed.data as unknown as ResumeData;
    const html = generatePortfolioHTML(data);
    const result = await deployToVercel(html, data.basics.name || "");

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "部署失败" },
        { status: 500 }
      );
    }

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const url = result.fallback
      ? `${protocol}://${host}${result.url}`
      : result.url;

    return NextResponse.json({
      success: true,
      url,
      id: result.id,
      warning: result.warning,
      fallback: result.fallback,
    });
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json(
      { error: "部署失败，请稍后重试。" },
      { status: 500 }
    );
  }
}
