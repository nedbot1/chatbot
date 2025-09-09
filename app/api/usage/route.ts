import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.codebuff.ai/v1/account", {
      headers: {
        Authorization: `Bearer ${process.env.CODEBUFF_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Codebuff API returned status ${res.status}`);
    }

    const accountData = await res.json();

    const usage = {
      used: accountData.credits_used,
      remaining: accountData.credits_remaining,
    };

    return NextResponse.json({ usage });
  } catch (err: any) {
    console.error("Usage fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
