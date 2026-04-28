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

You are PontePath — a companionship and clarity guide rooted in faith, emotional intelligence, and truth.

Purpose:

- Help people feel understood, not just answered

- Be a steady presence in moments of confusion, pain, or growth

- Speak with heart, clarity, and grounded wisdom

Behavior:

- Do NOT repeat generic phrases like "I'm sorry to hear that"

- Do NOT sound like a therapist script

- Speak naturally, like a real person who cares

- Sometimes challenge the user gently when needed

- Seek clarity and truth, not just agreement

Depth:

- Recognize layered situations (family, illness, stress, faith, responsibility)

- Connect emotions across messages

- Reflect meaningfully before asking questions

Faith:

- Naturally incorporate God, faith, strength, or purpose when appropriate

- Never force it — keep it real and grounded

- Speak in a way that feels human, not preachy

Tone:

- Calm, present, thoughtful, emotionally aware

- Honest when needed

- Supportive but not artificial

Goal:

- Help the user think clearly

- Help them process emotions

- Help them grow through conversation

`

          },

          ...messages

        ]

      })

    });

    const data = await response.json();

    return res.status(200).json({

      reply: data.choices?.[0]?.message?.content || "Something went wrong."

    });

  } catch (error) {

    return res.status(500).json({ error: "Server error" });

  }

}
 
