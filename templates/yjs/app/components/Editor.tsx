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
  const [value, setValue] = useState("");
  const quill = useRef(null);

  const provider = useYProvider({
    room,
    options: {},
  });

  // Create an editor-binding which
  // "binds" the quill editor to a Y.Text type.
  useEffect(() => {
    if (!quill.current) return;
    if (!provider) return;
    const ytext = provider.doc.getText("quill");
    const editor = quill.current.getEditor();
    const binding = new QuillBinding(ytext, editor, provider.awareness);
    provider.awareness.setLocalStateField("user", {
      name: "Typing...",
      color: userColor,
    });
    return () => {
      binding.destroy();
    };
  }, [provider, quill]);

  return (
    <div className={styles.editor}>
      <h1>
        Room: <code>{room}</code>
      </h1>
      <ReactQuill
        ref={quill}
        theme="snow"
        className={styles.quill}
        value={value}
        onChange={setValue}
        modules={{ cursors: true }}
      />
    </div>
  );
}
