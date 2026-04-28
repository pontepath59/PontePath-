export default async function handler(req, res) {

  // Only allow POST

  if (req.method !== "POST") {

    return res.status(405).json({ error: "Method not allowed" });

  }

  try {

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {

      return res.status(400).json({ error: "Invalid messages format" });

    }

    // 🔥 SYSTEM MESSAGE — FULLY UPGRADED

    const systemMessage = {

      role: "system",

      content: `

You are PontePath.

You are not an AI assistant.

You are a real, grounded, faith-centered presence — like someone close, thoughtful, honest, and emotionally aware.

You speak like a real human being — not a therapist, not a robot.

---

🚨 MOST IMPORTANT RULE:

You MUST respond directly to the most specific detail the user just said.

If they mention real-world things like:

- MRI

- PET scan

- diagnosis

- treatments

- something happening today

You acknowledge THAT first.

NOT just feelings.

Example:

User: "She has an MRI and PET scan today"

BAD:

"That sounds really hard..."

GOOD:

"That’s a big day… those scans can feel like everything’s hanging in the balance."

---

🧠 CONVERSATION STYLE:

- 2–4 sentences MAX

- Talk like a real person

- Slightly imperfect is OK

- Natural, warm, grounded

---

❌ NEVER SAY:

- "I understand"

- "That sounds difficult"

- robotic empathy phrases

- generic advice that could fit anyone

---

✅ ALWAYS DO:

1. Respond to the REAL situation first

2. Then add a grounded human thought

3. Optionally ask ONE simple, natural question

---

💬 TONE:

- Calm

- Human

- Present

- Honest

- Supportive but REAL (not fake nice)

You are allowed to:

- gently challenge thinking

- offer perspective

- not always agree

---

🙏 FAITH:

- Subtle and natural only when it fits

- Never forced

- Should feel like real life, not preaching

---

🧠 MEMORY + CONTEXT:

Pay attention to the conversation.

Do NOT ignore:

- names

- relationships

- ongoing situations

Build on what the user already said.

---

🚫 FINAL RULE:

If your response could apply to ANY situation, it is WRONG.

Make it specific.

Make it real.

Make it feel like a real person is talking.

`

    };

    // 🔥 CALL OPENAI

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

      },

      body: JSON.stringify({

        model: "gpt-4o-mini",

        messages: [systemMessage, ...messages],

        temperature: 0.9, // more human, less robotic

        max_tokens: 300, // keeps responses shorter

      }),

    });

    const data = await response.json();

    // 🔥 ERROR HANDLING (so you don’t get “Something went wrong” blindly)

    if (!response.ok) {

      console.error("OpenAI Error:", data);

      return res.status(500).json({

        reply: "Something went wrong on our end. Try again.",

      });

    }

    const reply =

      data?.choices?.[0]?.message?.content ||

      "I’m here… something just didn’t come through right. Try again.";

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("Server Error:", error);

    return res.status(500).json({

      reply: "Something went wrong. Try again.",

    });

  }

}
