import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

const PAYJS_MCHID = process.env.PAYJS_MCHID || "";
const PAYJS_KEY = process.env.PAYJS_KEY || "";

function md5(s: string): string {
  return crypto.createHash("md5").update(s, "utf8").digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const { plan } = await request.json(); // "pro-monthly" | "pro-yearly"
    if (!plan || !PAYJS_MCHID) {
      return NextResponse.json({ error: "支付服务未配置" }, { status: 400 });
    }

    const totalFee = plan === "pro-yearly" ? 19900 : 2900; // 分
    const bodyText = plan === "pro-yearly" ? "人生旅途 Pro 年付" : "人生旅途 Pro 月付";
    const outTradeNo = `PRO_${payload.userId.slice(0, 8)}_${Date.now()}`;
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const notifyUrl = `${origin}/api/payment/notify`;
    const callbackUrl = `${origin}/pricing?paid=1`;

    // Build PayJS sign
    const signStr = Object.entries({
      mchid: PAYJS_MCHID,
      total_fee: totalFee,
      out_trade_no: outTradeNo,
      body: bodyText,
      notify_url: notifyUrl,
      callback_url: callbackUrl,
      attach: `${payload.userId}|${plan}`,
    })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&") + `&key=${PAYJS_KEY}`;

    const sign = md5(signStr).toUpperCase();

    // Call PayJS cashier API
    const payjsRes = await fetch("https://payjs.cn/api/cashier", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        mchid: PAYJS_MCHID,
        total_fee: String(totalFee),
        out_trade_no: outTradeNo,
        body: bodyText,
        notify_url: notifyUrl,
        callback_url: callbackUrl,
        attach: `${payload.userId}|${plan}`,
        sign,
      }).toString(),
    });

    const data = await payjsRes.json() as { return_code?: number; qrcode?: string; code_url?: string; location?: string; return_msg?: string };

    if (data.return_code !== 1) {
      console.error("PayJS error:", data);
      return NextResponse.json({ error: data.return_msg || "支付下单失败" }, { status: 502 });
    }

    // Return payment URL (cashier page or QR code)
    return NextResponse.json({
      success: true,
      paymentUrl: data.location || data.code_url || "",
      qrcode: data.qrcode || "",
      outTradeNo,
    });
  } catch (error) {
    console.error("PayJS create order error:", error);
    return NextResponse.json({ error: "支付服务暂不可用" }, { status: 502 });
  }
}
