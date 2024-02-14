import OpenAI from "openai";
import { getEncoding } from "js-tiktoken";

export type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// For counting tokens. Correct encoder for gpt-3.5-turbo
const tiktoken = getEncoding("cl100k_base");

export async function getChatCompletionResponse(
  messages: OpenAIMessage[],
  onTokenCallback: (token: string) => void
) {
  // // If no organization is set, usage will count against the default key owner
  // if (!process.env.OPENAI_API_ORGANIZATION) {
  //   console.info(
  //     "No OPENAI_API_ORGANIZATION set, usage will count against the default key owner"
  //   );
  // }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_API_ORGANIZATION,
  });

  const prompt = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant. Your responses are always accurate and extremely brief.",
    } satisfies OpenAIMessage,
    ...messages,
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: prompt,
  });

  let response = "";
  for await (const part of stream) {
    const delta = part.choices[0]?.delta.content || "";
    response += delta;
    onTokenCallback(delta);
  }

  // Return the number of tokens used
  // This is the number of tokens used by the prompt, plus 4 for the role
  let usage = prompt.reduce((sum, msg) => {
    return (
      sum +
      tiktoken.encode(typeof msg.content === "string" ? msg.content : "")
        .length +
      4
    );
  }, 0);
  // Add the tokens used by the response, plus 3 overhead
  usage += tiktoken.encode(response).length + 3;
  return usage;
}
