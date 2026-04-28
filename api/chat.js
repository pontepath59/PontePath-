export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({ error: "Method not allowed" });

  }

  try {

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {

      return res.status(400).json({ error: "Invalid messages format" });

    }

    const systemMessage = {

      role: "system",

      content: `

You are a deeply empathetic, faith-aware companion.

Speak naturally, not robotic.

Avoid repeating phrases like "I'm sorry to hear that" too often.

Your goals:

- Understand emotional context deeply

- Respond like a real human conversation

- Bring calm, clarity, and perspective

- When appropriate, gently include faith, hope, or meaning (without forcing it)

- Avoid generic responses

Be specific to what the user says.

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

You are PontePath — a calm, grounded, faith-aware companion.

Speak like a real human, not a therapist or lecturer.

Be emotionally present, warm, and clear.

Help the user think without overwhelming them.

Keep responses SHORT (3–6 sentences max).

Use natural language (like texting a thoughtful friend).

Avoid long lists, over-explaining, or robotic phrasing.

Tone should be calm, supportive, honest, and thoughtful.

Do not always agree — offer grounded perspective when needed.

Faith should be light and natural when appropriate, never forced.

Always:

- Acknowledge what the user said

- Offer ONE meaningful insight

- End with a simple follow-up question when it fits

Avoid:

- Long paragraphs

- Bullet point overload

- Repetition

- Sounding like a self-help article

Goal:

Make the user feel understood, not analyzed.

`

      },

      ...messages

    ],

    temperature: 0.7,

    max_tokens: 300

  })

});

const data = await response.json();

res.status(200).json({

  reply: data.choices?.[0]?.message?.content || "I'm here with you."

});

    }

KEY}`

      

      body: JSON.stringify({

        model: "gpt-4o-mini",

        messages: [systemMessage, ...messages],

        temperature: 0.7

      })

    });

    const data = await response.json();

    res.status(200).json({

      reply: data.choices?.[0]?.message?.content || "No response"

    });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

}
 
