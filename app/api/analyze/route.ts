import { NextRequest, NextResponse } from "next/server";
import { extractHealthKeywords } from "@/lib/keywords";

const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn";

async function summarizeWithHuggingFace(text: string): Promise<string> {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) throw new Error("HF_API_KEY environment variable is not set.");

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_length: 130,
        min_length: 50,
        do_sample: false,
      },
      options: {
        wait_for_model: true,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("HF API error:", response.status, errBody);
    if (response.status === 503)
      throw new Error("Model is loading, please wait 20–30 seconds and retry.");
    if (response.status === 401)
      throw new Error("Invalid Hugging Face API key.");
    throw new Error(`Hugging Face API returned status ${response.status}.`);
  }

  const data = await response.json();

  if (Array.isArray(data) && data[0]?.summary_text) {
    return data[0].summary_text.trim();
  }

  throw new Error("Unexpected response format from Hugging Face API.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inputText: string = body?.text ?? "";

    if (!inputText || inputText.trim().length === 0)
      return NextResponse.json({ error: "Input text is required." }, { status: 400 });

    if (inputText.trim().length < 30)
      return NextResponse.json(
        { error: "Please enter at least 30 characters." },
        { status: 400 }
      );

    if (inputText.length > 5000)
      return NextResponse.json(
        { error: "Text too long. Keep it under 5000 characters." },
        { status: 400 }
      );

    const summary = await summarizeWithHuggingFace(inputText.trim());
    const keywords = extractHealthKeywords(inputText);

    return NextResponse.json({ summary, keywords }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[/api/analyze] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}