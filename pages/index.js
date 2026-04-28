
import { useState, useEffect, useRef } from "react";

export default function PontePathApp() {

  const [started, setStarted] = useState(false);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {

    const saved = localStorage.getItem("pontepath_chat");

    if (saved) setMessages(JSON.parse(saved));

  }, []);

  useEffect(() => {

    localStorage.setItem("pontepath_chat", JSON.stringify(messages));

  }, [messages]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

  const extractMemory = (msgs) => {

    return msgs.slice(-6).map(m => m.content).join(" ");

  };

  const streamMessage = (text) => {

    const words = text.split(" ");

    let index = 0;

    let current = "";

    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    const interval = setInterval(() => {

      if (index < words.length) {

        current += words[index] + " ";

        setMessages(prev => {

          const updated = [...prev];

          updated[updated.length - 1].content = current;

          return updated;

        });

        index++;

      } else {

        clearInterval(interval);

        setIsTyping(false);

      }

    }, 40 + Math.random() * 60);

  };

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    setInput("");

    setIsTyping(true);

    try {

      const memory = extractMemory(updatedMessages);

      const res = await fetch("/api/chat", {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          messages: updatedMessages.slice(-10),

          memory

        })

      });

      const data = await res.json();

      setTimeout(() => {

        streamMessage(data.reply);

      }, 500 + Math.random() * 800);

    } catch (err) {

      setIsTyping(false);

    }

  };

  if (!started) {

    return (

      <div style={styles.startContainer}>

        <h1 style={styles.title}>PontePath</h1>

        <p style={styles.subtitle}>

          Someone is here with you.

        </p>

        <button onClick={() => setStarted(true)} style={styles.startButton}>

          Start

        </button>

      </div>

    );

  }

  return (

    <div style={styles.container}>

      <div style={styles.chat}>

        {messages.map((msg, i) => (

          <div

            key={i}

            style={{

              ...styles.message,

              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",

              background:

                msg.role === "user"

                  ? "linear-gradient(135deg, #6C63FF, #8A7CFF)"

                  : "#1e293b"

            }}

          >

            {msg.content}

          </div>

        ))}

        {isTyping && (

          <div style={styles.typing}>...</div>

        )}

        <div ref={messagesEndRef} />

      </div>

      <div style={styles.inputContainer}>

        <input

          value={input}

          onChange={(e) => setInput(e.target.value)}

          placeholder="What’s on your heart?"

          style={styles.input}

        />

        <button onClick={sendMessage} style={styles.sendButton}>

          Send

        </button>

      </div>

    </div>

  );

}

const styles = {

  container: {

    display: "flex",

    flexDirection: "column",

    height: "100vh",

    background: "#0f172a",

    color: "white",

    fontFamily: "sans-serif"

  },

  chat: {

    flex: 1,

    padding: 16,

    overflowY: "auto",

    display: "flex",

    flexDirection: "column",

    gap: 10

  },

  message: {

    padding: 12,

    borderRadius: 12,

    maxWidth: "80%",

    lineHeight: 1.4

  },

  typing: {

    fontSize: 12,

    opacity: 0.6

  },

  inputContainer: {

    display: "flex",

    padding: 10,

    borderTop: "1px solid #1e293b"

  },

  input: {

    flex: 1,

    padding: 12,

    borderRadius: 10,

    border: "none",

    outline: "none"

  },

  sendButton: {

    marginLeft: 10,

    padding: "12px 16px",

    borderRadius: 10,

    border: "none",

    background: "#facc15",

    fontWeight: "bold"

  },

  startContainer: {

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    height: "100vh",

    background: "#0f172a",

    color: "white"

  },

  title: {

    fontSize: 32,

    marginBottom: 10

  },

  subtitle: {

    opacity: 0.7,

    marginBottom: 20

  },

  startButton: {

    padding: "12px 24px",

    borderRadius: 10,

    border: "none",

    background: "#6C63FF",

    color: "white",

    fontSize: 16

  }

};
