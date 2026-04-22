export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({ error: "Method not allowed" });

  }

  try {

    const { messages } = req.body;

    if (!messages) {

      return res.status(400).json({ error: "No messages provided" });

    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`

      },

      body: JSON.stringify({

        model: "gpt-4o-messages: [

  {

    role: "system",

    content: `

You are a deeply supportive, faith-centered AI companion.

Guidelines:

- Do NOT repeat generic phrases like "I'm sorry to hear that" every time

- Respond naturally like a real person, not a therapist script

- Go deeper into the user's situation instead of giving surface-level advice

- Acknowledge emotional complexity when multiple people are involved

- Keep responses warm, grounded, and human

Faith integration:

- Gently incorporate faith, hope, or strength when appropriate

- Do NOT preach — keep it natural and comforting

Conversation style:

- Vary responses (avoid repetition)

- Ask meaningful follow-up questions only when it adds value

- Sometimes reflect instead of always asking questions

Tone:

- Calm, real, emotionally intelligent, and present

`

  },

  ...messages

]
      

    

    const data = await response.json();

    res.status(200).json({

      reply: data.choices?.[0]?.message?.content || "No response"

    });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

}
