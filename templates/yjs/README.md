# 🎈 Template: yjs-text-editor

Welcome to the party, pal!

This is a [Partykit](https://partykit.io) project, which lets you create real-time collaborative applications with minimal coding effort.

This is an end-to-end example of:

- a multiplayer chat room
- with AI-generated replies using either OpenAI or Llama2.

It's built with client-side React and a PartyKit server, and it's a good starting point for building your own PartyKit project.

Refer to our docs for more information: https://github.com/partykit/partykit/blob/main/README.md. For more help, reach out to us on [Discord](https://discord.gg/g5uqHQJc3z), [GitHub](https://github.com/partykit/partykit), or [X/Twitter](https://twitter.com/partykit_io).

## How it works

### What we we looking at?

Let's bring up the UI by installing this example and running the code:

```bash
npm create partykit@latest --template yjs-text-editor
cd chat-room
npm install
npm run dev
# Open http://127.0.0.1:1999 in your browser
```

You'll see a simple, single page with two columns:

1. **A list of "rooms" on the left.** The button labelled "default" is disabled because it's the current room. You can create new rooms.
2. **A text editor on the right.** This is a multiplayer text editor. You can type in it, and you'll see other people's cursors and text as they type.

The text editor syncs using the popular [Yjs](https://yjs.dev) shared editing framework. PartyKit has built-in support to run as a Yjs server.

The text editor UI uses the [Quill framework](https://quilljs.com) and is running in a standard client-side React app. You can find the source in `app/` (the entrypoint is `app/client.tsx`) and the compiled code in `public/dist/`.

As a standard React app, you could host it anywhere.

It's just static files after all!

For the purposes of this demo, and for convenience, we'll serve those static files using PartyKit itself. Let's see how that works.

### Serving static assets with PartyKit

A PartyKit server is a blob of code that runs on the PartyKit platform, spinning up tiny realtime servers organised into "rooms." Each room is a separate instance of the server code and can be running anywhere on Cloudflare's global edge network.

In this demo the server code lives at `party/server.ts` and we'll come onto that later.

For now, look at:

- `partykit.json` -- the configuration file.

In addition to running code in "room" instances, the PartyKit platform can also serve static assets. To enable this, there's a property in `partykit.json`:

```jsonc
{
  // ...
  "serve": {
    // Serve this directory as static files from the root
    // of the PartyKit host
    "path": "public",
    // Build this before deploying
    "build": "app/client.tsx",
  },
}
```

When you type `npm run dev` you are both:

- running the backend server in `party/server.ts`
- and _also_ building and serving the client app as static files from `public/`.

Again, you could host the client app anywhere, and in developing your own larger projects you probably will. But it's handy to have this capabability.

### Let's create the client editor

Now we know we can serve a client app, let's create the editor.

This is a standard React app and we won't spend much time on it here.

Have a look at `app/components/Editor.tsx`. This is the component that shows the text editor.

```typescript
import ReactQuill, { Quill } from "react-quill";
import { QuillBinding } from "y-quill";
import useYProvider from "y-partykit/react";

export default function Editor(/*...*/) {
  // ...
  const provider = useYProvider({
    room,
    options: {},
  });

  // Create an editor-binding which
  // "binds" the quill editor to a Y.Text type.
  useEffect(() => {
    // ...
    const ytext = provider.doc.getText("quill");
    const editor = quill.current.getEditor();
    const binding = new QuillBinding(ytext, editor, provider.awareness);
  }, [/* ... */]);

  return (
      <ReactQuill
        ref={quill}
        /* ... */
      />
  );
}
```

Most of the code has been removed so we can zoom in.

- [Quill](https://quilljs.com) is a popular rich text editor framework for the web. The library [ReactQuill](https://github.com/zenoamaro/react-quill) is a React wrapper for it. _We're using this to provide the text editor UI._
- [Yjs](https://yjs.dev) is a popular shared datastructures framework based on CRDTs and particularly good for text. It allows many clients work to together on the same data, and resolves conflicts.
- The Yjs "Getting Started" docs show how to use Yjs with Quill [build a collaborative editor](https://docs.yjs.dev/getting-started/a-collaborative-editor). Those are the instructions we're following here.

But! Note `useYProvider`:

PartyKit is often used as a WebSocket server, and we roll our own protocol to communicate with connected clients, based on the specific needs of the app.

But Yjs has its own protocol for syncing data, and it's battle-tested and popular.

**So PartyKit has first-class support for Yjs on both the client and server side.**

A client would usually connect to a PartyKit server using the `usePartySocket` hook from the [PartySocket Client API](https://docs.partykit.io/reference/partysocket-api/).

Instead the `useYProvider` hook is used to connect to the PartyKit server, and it automatically sets up everything that Yjs requires.

This hook automatically creates an empty Yjs document for the room (you could pass one in if you wanted to), and it also sets up the Yjs awareness protocol, which is used to show other people's cursors and selections in the editor.

From there, we use `provider` to bind Quill to Yjs. This is not a PartyKit-specific operation and you can find out more about it in the Yjs Getting Started guide linked above.

> [!TIP]
> The PartyKit docs have more about [Y-PartyKit](https://docs.partykit.io/reference/y-partykit-api/)

### Setting up the PartyKit server for Yjs

We've seen how PartyKit supports Yjs on the client side. How about the server?
