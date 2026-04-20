import { NextRequest, NextResponse } from "next/server";
import { extractHealthKeywords } from "@/lib/keywords";

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

interface StructuredAnalysis {
  summary: string;
  possibleCauses: string[];
  careSuggestions: string[];
  redFlags: string[];
}

interface ChatCompletionOptions {
  useStructuredOutput: boolean;
}

function normalizeBulletList(items: unknown, fallback: string[]): string[] {
  if (!Array.isArray(items)) return fallback;

  const cleaned = items
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return cleaned.length > 0 ? cleaned : fallback;
}

function parseStructuredAnalysis(content: string): StructuredAnalysis {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : trimmed;
  const parsed = JSON.parse(candidate) as Partial<StructuredAnalysis>;

  return {
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim().length > 0
        ? parsed.summary.trim()
        : "The symptoms are too brief for a reliable explanation. Please add duration, temperature, other symptoms, age, and any medical conditions.",
    possibleCauses: normalizeBulletList(parsed.possibleCauses, [
      "A short symptom note is not enough to identify a single cause with confidence.",
      "Common explanations can include minor viral illness, dehydration, inflammation, or stress depending on the full context.",
    ]),
    careSuggestions: normalizeBulletList(parsed.careSuggestions, [
      "Rest, stay hydrated, and monitor whether the symptom is improving or getting worse.",
      "Seek advice from a qualified clinician if the symptom is persistent, severe, or unusual for you.",
    ]),
    redFlags: normalizeBulletList(parsed.redFlags, [
      "Get urgent medical care for trouble breathing, chest pain, confusion, fainting, or symptoms that rapidly worsen.",
    ]),
  };
}

async function analyzeWithHuggingFace(text: string): Promise<StructuredAnalysis> {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) throw new Error("HF_API_KEY environment variable is not set.");

  const baseInstruction =
    "You are a cautious health education assistant. Explain symptoms in simple language. Do not give a final diagnosis. Do not promise a cure. Mention that multiple causes are possible when appropriate. The summary must be 2 to 4 sentences and should explain what the symptom may mean and why it can happen. Use plain ASCII characters only. Return JSON only with the keys summary, possibleCauses, careSuggestions, and redFlags. Each list should contain 2 to 4 short bullet-style strings. Keep the tone supportive and practical.";

  const messages = [
    {
      role: "system",
      content: baseInstruction,
    },
    {
      role: "user",
      content: `Analyze this symptom or health note and explain what it may mean in plain language:\n\n${text}`,
    },
  ];

  async function requestCompletion({
    useStructuredOutput,
  }: ChatCompletionOptions): Promise<string> {
    const payload: Record<string, unknown> = {
      model: HF_MODEL,
      messages,
      max_tokens: 500,
      temperature: 0.2,
    };

    if (useStructuredOutput) {
      payload.response_format = {
        type: "json_schema",
        json_schema: {
          name: "health_analysis",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "summary",
              "possibleCauses",
              "careSuggestions",
              "redFlags",
            ],
            properties: {
              summary: {
                type: "string",
              },
              possibleCauses: {
                type: "array",
                items: { type: "string" },
              },
              careSuggestions: {
                type: "array",
                items: { type: "string" },
              },
              redFlags: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      };
    }

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("HF API error:", response.status, errBody);
      if (response.status === 503)
        throw new Error("Model is loading, please wait 20–30 seconds and retry.");
      if (response.status === 401)
        throw new Error("Invalid Hugging Face API key.");
      if (response.status === 402 || response.status === 429)
        throw new Error("Hugging Face rate limit reached. Please retry in a minute.");
      if (useStructuredOutput && (response.status === 400 || response.status === 422)) {
        throw new Error("STRUCTURED_OUTPUT_UNSUPPORTED");
      }
      throw new Error(`Hugging Face API returned status ${response.status}.`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content === "string" && content.trim().length > 0) {
      return content;
    }

    throw new Error("Unexpected response format from Hugging Face API.");
  }

  try {
    const content = await requestCompletion({ useStructuredOutput: true });
    return parseStructuredAnalysis(content);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== "STRUCTURED_OUTPUT_UNSUPPORTED"
    ) {
      throw error;
    }
  }

  const fallbackContent = await requestCompletion({ useStructuredOutput: false });
  return parseStructuredAnalysis(fallbackContent);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inputText: string = body?.text ?? "";

    if (!inputText || inputText.trim().length === 0)
      return NextResponse.json({ error: "Input text is required." }, { status: 400 });

    if (inputText.trim().length < 5)
      return NextResponse.json(
        { error: "Please enter at least 5 characters." },
        { status: 400 }
      );

    if (inputText.length > 5000)
      return NextResponse.json(
        { error: "Text too long. Keep it under 5000 characters." },
        { status: 400 }
      );

    const analysis = await analyzeWithHuggingFace(inputText.trim());
    const keywords = extractHealthKeywords(inputText);

    return NextResponse.json(
      {
        summary: analysis.summary,
        possibleCauses: analysis.possibleCauses,
        careSuggestions: analysis.careSuggestions,
        redFlags: analysis.redFlags,
        keywords,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[/api/analyze] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
