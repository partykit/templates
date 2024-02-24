export type Message = {
  id: string;
  user: string;
  body: string;
  role: "user" | "assistant";
};

export type User = {
  name: string;
};

export function createMessage(
  user: User,
  body: string,
  role?: "user" | "assistant"
): Message {
  return {
    id: Math.random().toString(36).slice(2, 9),
    user: user.name,
    body,
    role: role || "user",
  };
}

export type WSMessage =
  | {
      type: "update";
      message: Message;
    }
  | {
      type: "history";
      messages: Message[];
    }
  | {
      type: "delete";
      id: string;
    };
