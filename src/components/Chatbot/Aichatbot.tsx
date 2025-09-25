import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "user" | "bot";
  content: string;
};

const Aichatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "bot", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const [botText, setBotText] = useState(
    "This is a placeholder response from the AI chatbot."
  );
  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      // Replace this with backend call

      //   setBotText("This is a placeholder response from the AI chatbot.");
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", content: botText },
      ]);
      await new Promise((r) => setTimeout(r, 400));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid place-items-center bg-white">
      <div className="w-full max-w-2xl h-[70vh] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-stretch mx-4">
        <header className="px-4 py-3 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-blue-600">AI Chatbot</h1>
        </header>

        {/* Chat log */}
        <div
          ref={logRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={[
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow",
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900",
                ].join(" ")}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={send} className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <button
              type="submit"
              disabled={sending || input.trim().length === 0}
              className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-60 hover:bg-blue-700"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Aichatbot;
