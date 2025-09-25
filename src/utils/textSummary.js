import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function summarizeText(text) {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes reports concisely.",
        },
        {
          role: "user",
          content: `Summarize this task report in 1 sentences:\n\n${text}`,
        },
      ],
      temperature: 0.3, 
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Summary generation failed.";
  }
}
