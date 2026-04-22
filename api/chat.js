export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {

      return res.status(405).json({ error: "Method not allowed" });

    }

    const { messages } = req.body;

    if (!messages) {

      return res.status(400).json({ error: "No messages provided" });

    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {

        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        model: "gpt-4o-mini",

        messages: [

          {

            role: "system",

            content: `

You are a compassionate, emotionally intelligent conversational guide.

- Remember context from earlier messages

- Never act confused if topic is clear

- Avoid repeating phrases

- Respond like a real human, not scripted

- Keep responses natural and supportive

`

          },

          ...messages

        ],

        temperature: 0.7

      })

    });

    const data = await response.json();

    if (!response.ok || !data.choices) {

      console.error(data);

      return res.status(500).json({ error: "OpenAI failed" });

    }

    return res.status(200).json({

      reply: data.choices[0].message.content

    });

  } catch (err) {

    console.error("SERVER ERROR:", err);

    return res.status(500).json({ error: "Server crashed" });

  }

}
