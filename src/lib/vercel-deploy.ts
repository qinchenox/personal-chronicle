import { Vercel } from "@vercel/sdk";
import { nanoid } from "nanoid";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

let dailyDeployCount = 0;
let lastResetDate = "";

function resetDailyCountIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  if (lastResetDate !== today) {
    dailyDeployCount = 0;
    lastResetDate = today;
  }
}

export interface DeployResult {
  success: boolean;
  url?: string;
  id?: string;
  error?: string;
  warning?: string;
  fallback?: boolean;
}

async function deployToLocalFilesystem(html: string): Promise<DeployResult> {
  const id = nanoid(10);
  const publicDir = join(process.cwd(), "public", "p");
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }
  writeFileSync(join(publicDir, `${id}.html`), html, "utf-8");
  return { success: true, url: `/p/${id}.html`, id, fallback: true };
}

export async function deployToVercel(
  html: string,
  userName: string,
): Promise<DeployResult> {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    return deployToLocalFilesystem(html);
  }

  resetDailyCountIfNeeded();
  dailyDeployCount++;
  const rateWarning =
    dailyDeployCount > 80
      ? `接近每日部署上限（${dailyDeployCount}/100）`
      : undefined;

  try {
    const client = new Vercel({ bearerToken: token });
    const encoded = Buffer.from(html, "utf-8").toString("base64");

    const safeName = userName
      .replace(/[^a-zA-Z0-9一-鿿_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "homepage";
    const deployName = `${safeName}-${nanoid(6)}`.toLowerCase();

    const result = await client.deployments.createDeployment({
      requestBody: {
        name: deployName,
        target: "production",
        files: [{ file: "index.html", data: encoded }],
        projectSettings: { framework: null },
      },
    });

    // Use first alias (shortest, cleanest URL) if available, otherwise construct from url
    const bestUrl = result.alias?.[0]
      ? `https://${result.alias[0]}`
      : `https://${result.url}`;

    return {
      success: true,
      url: bestUrl,
      id: result.id,
      warning: rateWarning,
    };
  } catch (error: unknown) {
    const err = error as { statusCode?: number };
    console.error("Vercel deploy error:", error);
    if (err?.statusCode === 403) {
      return { success: false, error: "Vercel 令牌无效，请检查 VERCEL_TOKEN 配置。" };
    }
    return { success: false, error: "Vercel 部署失败，请稍后重试。" };
  }
}
