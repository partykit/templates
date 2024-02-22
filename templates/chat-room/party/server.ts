import type * as Party from "partykit/server";
import { Ai } from "partykit-ai";
import { type Message, createMessage, type WSMessage } from "./shared";
import { getChatCompletionResponse, type OpenAIMessage } from "./openai";
import { EventSourceParserStream } from "eventsource-parser/stream";

const AI_USER = { name: "AI" };

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

      // Check if the AI should reply
      if (!(await this.shouldReply())) return;

      // If you don't have an OpenAI key, comment out the next line and uncomment replyWithLlama
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

  async shouldReply() {
    // 1. Create a transcript of the last 5 messages
    const transcript = this.messages
      .slice(-5)
      .map((msg) => `${msg.role === "assistant" ? "AI" : "User"}: ${msg.body}`)
      .join("\n");

    // 2. Create a prompt that asks the AI whether it should INTERJECT or remain QUIET
    const messages = [
      {
        role: "system",
        // Rationale:
        // - Differentiate between the AI answering here and the AI in the transcript
        // - Specify this is a multi-party conversation so the AI doesn't reply every time
        content:
          "You are a software program able to understand intent in multi-party conversations. You will be given a sample conversation transcript between multiple users plus an AI, and asked a question.",
      },
      {
        role: "user",
        // Rationale:
        // - Include the transcript in delimiters so it's isolated from the broader prompt
        //   (which also uses a 'role: message' behind the scenes)
        // - Include a number of references so that the AI can discriminate based on context
        content:
          "The conversation transcript is contained in backtick delimiters below: ```\n" +
          transcript +
          "\n```",
      },
      {
        role: "user",
        // Rationale:
        // - "Helpful" AIs are biased towards replying every time, so be strict about limiting responses
        // - Including reasoning introduces chain-of-thought, which makes the judgement more reliable
        // - The judgement words are semantically meaningful, not just "yes" or "no"
        content:
          "Question: 'AI' should reply only when being addressed by name. Looking at the last message from 'User' in the transcript, should 'AI' interject this time? Respond in the following format:\n\nReasoning: (give very brief reasoning here)\nJudgement: INTERJECT|QUIET (choose one)",
      },
    ];

    // 3. Use Mistral to decide whether to reply.
    // If the response includes "INTERJECT", we'll escalate to the conversational model
    const run = (await this.ai.run("@hf/thebloke/neural-chat-7b-v3-1-awq", {
      messages,
      stream: false,
    })) as { response: string };

    return run.response.includes("INTERJECT");
  }
}
