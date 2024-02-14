import type * as Party from "partykit/server";
import { Ai } from "partykit-ai";
import { type Message, createMessage, type WSMessage } from "./shared";
import { getChatCompletionResponse, type OpenAIMessage } from "./openai";
import { EventSourceParserStream } from "eventsource-parser/stream";

const AI_USER = { name: "AI" };

async function shouldReply(message: string): Promise<boolean> {
  // for a given message, let's ask OpenAI whether we should reply

  const prompt = [
    {
      role: "system",
      content: `
You are a helpful AI assistant that determines whether a message is a question to the Ai assistant. 
Your response should be a single YES or NO.`,
    },
  ];
  const messages = [
    ...prompt,
    { role: "user", content: message },
  ] as OpenAIMessage[];

  let response = "";

  await getChatCompletionResponse(messages, (token) => {
    response += token;
  });

  if (response.includes("YES")) {
    return true;
  }
  return false;
}

export default class ChatServer implements Party.Server {
  messages: Message[] = [];
  ai: Ai;

  constructor(public room: Party.Room) {
    this.ai = new Ai(room.context.ai);
  }

  // a typesafe wrapper around sending a message
  send(socket: Party.Connection, msg: WSMessage) {
    socket.send(JSON.stringify(msg));
  }

  // a typesafe wrapper around broadcasting a message
  broadcast(msg: WSMessage, exclude: string[] = []) {
    this.room.broadcast(JSON.stringify(msg), exclude);
  }

  onConnect(connection: Party.Connection) {
    this.send(connection, { type: "history", messages: this.messages });
  }

  async onMessage(messageString: string, connection: Party.Connection) {
    // Assume the message is JSON and parse it
    const msg = JSON.parse(messageString);
    // We differentiate between messages by giving them a type
    if (msg.type === "message") {
      // Update the server's state, which is the source of truth
      this.messages.push(msg.message);
      // Send the new message to all clients
      this.broadcast(
        {
          type: "update",
          message: msg.message,
        },
        [connection.id]
      );

      // Optionally use OpenAI
      await this.replyWithOpenAI();
      //await this.replyWithLlama();
    }
  }

  async onRequest(_: Party.Request) {
    return new Response(
      `Hello from onRequest!\n\nparty: ${this.room.name}\n room: ${this.room.id}`
    );
  }

  async replyWithOpenAI() {
    const messages = this.messages.map((msg) => {
      return { role: msg.role, content: msg.body } as OpenAIMessage;
    });
    const aiMsg = createMessage(AI_USER, "Thinking...", "assistant");
    this.messages.push(aiMsg);
    // this.broadcast(
    //  { type: "update", message: aiMsg }
    // );

    const shouldTheAiReply = await shouldReply(
      messages[messages.length - 1].content as string
    );

    if (!shouldTheAiReply) {
      this.messages = this.messages.filter((msg) => msg.id !== aiMsg.id);
      // this.broadcast({ type: "delete", id: aiMsg.id });
      return;
    }

    let text = "";
    const usage = await getChatCompletionResponse(messages, (token) => {
      text += token;
      aiMsg.body = text;
      this.broadcast({ type: "update", message: aiMsg });
    });
    console.log("OpenAI usage", usage);
  }

  async replyWithLlama() {
    // 1. Setup
    const messages = this.messages.map((msg) => {
      return { role: msg.role, content: msg.body };
    });
    const aiMsg = createMessage(AI_USER, "...", "assistant");
    this.messages.push(aiMsg);

    // 2. Run the AI
    const prompt = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant. Your responses are always accurate and extremely brief.",
      },
      ...messages,
    ];
    const stream = await this.ai.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: prompt,
      stream: true,
    });
    const eventStream = stream
      .pipeThrough(new TextDecoderStream("utf-8"))
      .pipeThrough(new EventSourceParserStream());

    // 3. Process the streamed response
    let response = "";
    for await (const part of eventStream) {
      if (part.data === "[DONE]") break;
      const decoded = JSON.parse(part.data);
      response += decoded.response;
      aiMsg.body = response;
      this.broadcast({ type: "update", message: aiMsg });
    }
  }
}
