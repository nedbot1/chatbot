import { NextRequest, NextResponse } from "next/server";
import { CodebuffClient } from "@codebuff/sdk";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message)
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );

    const client = new CodebuffClient({
      apiKey: process.env.CODEBUFF_API_KEY!,
      cwd: process.cwd(),
      onError: (err) => console.error("Codebuff error:", err.message),
    });

    const response = await client.run({
      agent: "base",
      prompt: `You are a knowledgeable general knowledge expert. Answer this question factually: "${message}"`,
    });

    client.closeConnection?.();

    // Extract and clean bot reply
    let replyText = "";
    if (response.output && "value" in response.output) {
      replyText = response.output.value ?? "";
    }
    replyText = replyText
      .replace(/<codebuff_tool_call>[\s\S]*?<\/codebuff_tool_call>/g, "")
      .trim();

    // Extract credits used
    const creditsUsed = response.sessionState?.mainAgentState?.creditsUsed ?? 0;

    return NextResponse.json({ reply: replyText, creditsUsed });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_API_KEY,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { message } = await req.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 }
//       );
//     }

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a helpful general knowledge assistant. Give clear and factual answers.",
//         },
//         { role: "user", content: message },
//       ],
//     });

//     const reply = completion.choices[0].message?.content;
//     return NextResponse.json({ reply });
//   } catch (err: any) {
//     console.error("OpenAI API Error:", err); // 👈 log error
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
