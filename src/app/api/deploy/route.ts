import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { nanoid } from "nanoid";
import { generatePortfolioHTML } from "@/lib/html-generator";
import { ResumeData } from "@/lib/types";
import { z } from "zod";

const basicsSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  summary: z.string(),
  avatar: z.string(),
  media: z.array(z.any()).optional(),
}).passthrough();

const resumeDataSchema = z.object({
  basics: basicsSchema,
  skills: z.array(z.object({
    id: z.string(),
    category: z.string(),
    items: z.array(z.string()),
  }).passthrough()),
  experience: z.array(z.object({
    id: z.string(),
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
  }).passthrough()),
  education: z.array(z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  })),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    url: z.string(),
    highlights: z.array(z.string()),
  }).passthrough()),
  languages: z.array(z.object({
    id: z.string(),
    language: z.string(),
    proficiency: z.string(),
  })),
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
  })),
  themeId: z.string(),
}).passthrough();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resumeDataSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "无效的简历数据" },
        { status: 400 }
      );
    }

    const html = generatePortfolioHTML(parsed.data as unknown as ResumeData);
    const id = nanoid(10);
    const publicDir = join(process.cwd(), "public", "p");
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }
    writeFileSync(join(publicDir, `${id}.html`), html, "utf-8");

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const url = `${protocol}://${host}/p/${id}.html`;

    return NextResponse.json({ success: true, url, id });
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json(
      { error: "部署失败，请稍后重试。" },
      { status: 500 }
    );
  }
}
