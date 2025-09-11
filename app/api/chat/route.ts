import { NextRequest, NextResponse } from "next/server";
import { CodebuffClient } from "@codebuff/sdk";

export async function POST(req: NextRequest) {
  // Add CORS headers for mobile app
  const response = new NextResponse();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
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

    const jsonResponse = NextResponse.json({ reply: replyText, creditsUsed });
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return jsonResponse;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Chat error:", errorMessage);
    const errorResponse = NextResponse.json({ error: errorMessage }, { status: 500 });
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
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
