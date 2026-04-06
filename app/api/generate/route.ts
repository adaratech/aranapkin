import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export const maxDuration = 60;

export async function POST(req: Request): Promise<Response> {
  const { prompt } = (await req.json()) as { prompt: string };

  if (!prompt?.trim()) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    prompt,
    maxOutputTokens: 8192,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json(
      { error: "Failed to parse diagram response" },
      { status: 500 }
    );
  }

  const result = JSON.parse(jsonMatch[0]);
  return Response.json(result);
}
