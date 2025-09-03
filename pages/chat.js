import { useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  async function sendMessage() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setReply(data.reply);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat with GPT 🚀</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <br />
      <button onClick={sendMessage}>Send</button>
      <p>
        <b>GPT:</b> {reply}
      </p>
    </div>
  );
}
