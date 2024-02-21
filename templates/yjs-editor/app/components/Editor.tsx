import { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import { QuillBinding } from "y-quill";
import useYProvider from "y-partykit/react";
import "react-quill/dist/quill.snow.css";
import styles from "./Editor.module.css";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

export default function Editor({
  room,
  userColor,
}: {
  room: string;
  userColor: string;
}) {
  const [text, setText] = useState("");
  const quill = useRef<ReactQuill>(null);

  const provider = useYProvider({
    room,
  });

  // Create an editor-binding which
  // "binds" the quill editor to a Y.Text type.
  useEffect(() => {
    const ytext = provider.doc.getText("quill");
    const editor = quill.current!.getEditor();
    const binding = new QuillBinding(ytext, editor, provider.awareness);
    provider.awareness.setLocalStateField("user", {
      name: "Typing...",
      color: userColor,
    });
    return () => {
      binding.destroy();
    };
  }, [userColor, provider, quill]);

  return (
    <div className={styles.editor}>
      <h1>
        Editor <code>Room #{room}</code>
      </h1>
      <ReactQuill
        ref={quill}
        theme="snow"
        className={styles.quill}
        value={text}
        onChange={setText}
        modules={{ cursors: true }}
      />
    </div>
  );
}
