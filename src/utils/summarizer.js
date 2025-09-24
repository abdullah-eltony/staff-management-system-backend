import { pipeline } from "@xenova/transformers";

export async function summarizeText(text) {
  // Initialize summarization pipeline (loads a small model locally)
  const summarizer = await pipeline("summarization");

  // Run summarization
  const output = await summarizer(text, { max_length: 40, min_length: 30 });

  return output[0].summary_text;
}
