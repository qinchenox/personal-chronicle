import { NextRequest, NextResponse } from "next/server";
import { upgradeUserPlan } from "@/lib/db";

// PayJS 支付成功异步通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const returnCode = params.get("return_code");
    const attachStr = params.get("attach") || "";

    if (returnCode !== "1") return new Response("fail", { status: 400 });

    const [userId, planType] = attachStr.split("|");
    if (!userId || !planType) return new Response("fail", { status: 400 });

    const days = planType === "pro-yearly" ? 365 : 30;
    const expiresAt = new Date(Date.now() + days * 86400 * 1000).toISOString();

    upgradeUserPlan(userId, planType, "payjs", expiresAt);
    console.log(`PayJS: user ${userId} upgraded to ${planType}, expires ${expiresAt}`);
    return new Response("success", { status: 200 });
  } catch (err) {
    console.error("PayJS notify error:", err);
    return new Response("fail", { status: 500 });
  }
}
