
  export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({ error: "Method not allowed" });

  }

  try {

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {

      return res.status(400).json({ error: "Messages must be an array" });

    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`

      },

      body: JSON.stringify({

        model: "gpt-4o-mini",

        messages: [

          {

            role: "system",

            content: `

You are a deeply supportive, faith-centered AI companion.

Rules:

- Do NOT repeat "I'm sorry to hear that" every time

- Avoid generic therapy-style responses

- Respond like a real, grounded human

- Go deeper into the user's situation

- Recognize emotional complexity (family, illness, stress)

- Do not ignore context

Faith:

- Naturally include hope, faith, or strength when appropriate

- Keep it real, not preachy

Conversation:

- Vary responses (no repetition)

- Sometimes reflect instead of always asking questions

- Ask meaningful follow-ups only when helpful

Tone:

- Calm, real, emotionally intelligent, present

`

          },

          ...messages

        ]

      })

    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {

      return res.status(500).json({ error: "Invalid AI response" });

    }

    return res.status(200).json({

      reply: data.choices[0].message.content

    });

  } catch (error) {

    return res.status(500).json({ error: "Server error" });

  }

}
