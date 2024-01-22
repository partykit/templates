import OpenAI from "openai";
import { getEncoding } from "js-tiktoken";

export type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// For counting tokens. Correct encoder for gpt-3.5-turbo
const tiktoken = getEncoding("cl100k_base");

export async function getChatCompletionResponse(
  env: Record<string, any>,
  messages: OpenAIMessage[],
  onTokenCallback: (token: string) => void
) {
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY as string,
    organization: env.OPENAI_API_ORGANIZATION as string,
  });

  const prompt = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant. Your responses are always accurate and extremely brief.",
    } as OpenAIMessage,
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
