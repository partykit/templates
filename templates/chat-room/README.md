# 🎈 chat-room

Welcome to the party, pal!

This is a [Partykit](https://partykit.io) project, which lets you create real-time collaborative applications with minimal coding effort.

[`server.ts`](./src/server.ts) is the server-side code, which is responsible for handling WebSocket events and HTTP requests. [`client.ts`](./src/client.ts) is the client-side code, which connects to the server and listens for events.

You can start developing by running `npm run dev` and opening [http://localhost:1999](http://localhost:1999) in your browser. When you're ready, you can deploy your application on to the PartyKit cloud with `npm run deploy`.

Refer to our docs for more information: https://github.com/partykit/partykit/blob/main/README.md. For more help, reach out to us on [Discord](https://discord.gg/g5uqHQJc3z), [GitHub](https://github.com/partykit/partykit), or [Twitter](https://twitter.com/partykit_io).

## How it works

### What are we looking at?

Let's bring up the UI by installing this example and running the code:

```bash
npm create partykit@latest --template chat-room
cd chat-room
npm install
npm run dev
# Open http://127.0.0.1:1999 in your browser
```

You'll see a simple, single page chat room. There won't be any messages. There's a text input at the bottom.

This web UI has no functionality of its own. To handle messages, it connects to a PartyKit server. We'll look at that in the next section.

This chat room UI is a standard client-side React application. You can find the source in `src/` (the entrypoint is `src/client.tsx`) and the compiled code in `public/dist/`.

As a standard React app, you could host it anywhere.

For the purposes of this demo, and for convenience, we'll serve it using PartyKit itself. Let's look at the PartyKit server and how that works.

### Finding our way around the PartyKit server

To understand the server we'll be looking at two files:

- `party/server.ts` -- the PartyKit server itself
- `partykit.json` -- the configuration file.

A PartyKit server is a blob of code that runs on the PartyKit platform, spinning up tiny realtime servers organised into "rooms." Each room is a separate instance of the server code and can be running anywhere on Cloudflare's global edge network.

So our chatroom UI talks to a backend server, over a WebSocket connection and sometimes over HTTP, and that server is re-broadcasting messages to the room, generating replies using AI, and so on.

Because it's often convenient, the PartyKit platform can also serve static files. To enable this, there's a property in `partykit.json`:

```jsonc
{
  // ...
  "serve": {
    // Serve this directory as static files from the root
    // of the PartyKit host
    "path": "public",
    // Run this build script before serving
    "build": "src/client.tsx",
  },
}
```

When you type `npm run dev` you are automatically:

- running the backend server in `party/server.ts`
- and _also_ building and serving the client app.

Again, you could host the client app anywhere, and in developing your own larger projects you probably will. But it's handy to have this capabability.
