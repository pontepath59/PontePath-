import { useState, useEffect } from “react”;

export default function PontePathApp() {
const [messages, setMessages] = useState([]);
const [input, setInput] = useState(””);
const [isTyping, setIsTyping] = useState(false);

// Load saved messages
useEffect(() => {
const saved = localStorage.getItem(“pontepath_chat”);
if (saved) setMessages(JSON.parse(saved));
}, []);

// Save messages
useEffect(() => {
localStorage.setItem(“pontepath_chat”, JSON.stringify(messages));
}, [messages]);

// Simulate typing (streaming feel)
const streamMessage = (text) => {
let i = 0;
let current = “”;
