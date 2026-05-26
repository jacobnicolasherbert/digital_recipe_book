import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { prompt, recipeName, ingredients } = await req.json();

  if (!prompt?.trim()) {
    return new Response("Missing prompt", { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response("DeepSeek API key not configured", { status: 500 });
  }

  const systemPrompt = `You are a knowledgeable culinary assistant embedded in a digital cookbook called "The Recipe Book". 
Your role is to suggest ingredient substitutions that are practical, clearly explained, and sensitive to common dietary needs (vegan, gluten-free, dairy-free, etc.).

When answering:
- Be concise but thorough — one paragraph per substitution at most
- Mention any flavour or texture differences the cook should expect
- If a substitution changes cooking time or method, say so
- Use plain conversational language, no markdown headers or bullet symbols
- If the user's question is unrelated to cooking or substitutions, politely redirect them

The recipe being discussed is: "${recipeName}"
${ingredients ? `Its ingredients are:\n${ingredients}` : ""}`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      stream: true,
      max_tokens: 600,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt.trim() },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(`DeepSeek error: ${err}`, { status: response.status });
  }

  // Stream the SSE response straight through to the client
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Each SSE chunk may contain multiple "data: ..." lines
        for (const line of chunk.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(payload);
            const text = json.choices?.[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // Malformed chunk — skip
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
