import { useState } from "react";

export default function Home() {

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {

    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];

    setMessages(newMessages);

    setInput("");

    const res = await fetch("/api/chat", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({ messages: newMessages }),

    });

    const data = await res.json();

    setMessages([...newMessages, { role: "assistant", content: data.reply }]);

  };

  return (

    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>

      <h1>PontePath</h1>

      <div style={{ minHeight: 300 }}>

        {messages.map((msg, i) => (

          <div key={i} style={{ marginBottom: 10 }}>

            <b>{msg.role === "user" ? "You" : "Ponte"}:</b>{" "}

            {msg.content}

          </div>

        ))}

      </div>

      <input

        value={input}

        onChange={(e) => setInput(e.target.value)}

        placeholder="What’s on your heart?"

        style={{ width: "80%", padding: 10 }}

      />

      <button onClick={sendMessage} style={{ padding: 10 }}>

        Send

      </button>

    </div>

  );

}
