import type * as Party from "partykit/server";
import { Ai } from "partykit-ai";
import { type Message, createMessage } from "./shared";
import { getChatCompletionResponse, type OpenAIMessage } from "./openai";
// @ts-ignore
import { EventSourceParserStream } from "eventsource-parser/stream";

const AI_USER = { name: "AI" };

export default class ChatServer implements Party.Server {
  messages: Message[] = [];
  ai: Ai;

  constructor(public room: Party.Room) {
    this.messages = [];
    this.ai = new Ai(room.context.ai);
  }

  onConnect(connection: Party.Connection) {
    connection.send(
      JSON.stringify({ type: "history", messages: this.messages })
    );
  }

  async onMessage(messageString: string, connection: Party.Connection) {
    // Assume the message is JSON and parse it
    const msg = JSON.parse(messageString);
    // We differentiate between messages by giving them a type
    if (msg.type === "message") {
      // Update the server's state, which is the source of truth
      this.messages.push(msg.message);
      // Send the new message to all clients
      this.room.broadcast(
        JSON.stringify({ type: "update", message: msg.message }),
        [connection.id]
      );

      // Optionally use OpenAI
      //await this.replyWithOpenAI();
      await this.replyWithLlama();
    }
  }

  async replyWithOpenAI() {
    const messages = this.messages.map((msg) => {
      return { role: msg.role, content: msg.body } as OpenAIMessage;
    });
    const aiMsg = createMessage(AI_USER, "Thinking...", "assistant");
    this.messages.push(aiMsg);

    let text = "";
    const usage = await getChatCompletionResponse(messages, (token) => {
      text += token;
      aiMsg.body = text;
      this.room.broadcast(JSON.stringify({ type: "update", message: aiMsg }));
    });
    console.log("OpenAI usage", usage);
  }

  async replyWithLlama() {
    // Setup
    const messages = this.messages.map((msg) => {
      return { role: msg.role, content: msg.body } as any; //as OpenAIMessage;
    });
    const aiMsg = createMessage(AI_USER, "Thinking...", "assistant");
    this.messages.push(aiMsg);

    // Run the AI
    const prompt = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant. Your responses are always accurate and extremely brief.",
      } as any, //as OpenAIMessage,
      ...messages,
    ];
    const stream = await this.ai.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: prompt as any,
      stream: true,
    });
    const eventStream = stream
      .pipeThrough(new TextDecoderStream("utf-8"))
      .pipeThrough(new EventSourceParserStream());

    // Process the streamed response
    let response = "";
    for await (const part of eventStream) {
      if (part.data === "[DONE]") break;
      const decoded = JSON.parse(part.data);
      response += decoded.response;
      aiMsg.body = response;
      this.room.broadcast(JSON.stringify({ type: "update", message: aiMsg }));
    }
  }
}
