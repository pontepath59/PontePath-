export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {

      return res.status(405).json({ error: "Method not allowed" });

    }

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({ error: "No message provided" });

    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {

      return res.status(500).json({ error: "Missing API key" });

    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {

        "Authorization": `Bearer ${apiKey}`,

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        model: "gpt-4o-mini",

        messages: [

          {

            role: "system",

            content: "You are a compassionate, natural conversational guide. Avoid repetition and respond like a real human."

          },

          {

            role: "user",

            content: message

          }

        ]

      })

    });

    const data = await response.json();

    // 🔴 THIS is where most apps break — we protect it

    if (!response.ok || !data.choices) {

      console.error("OpenAI error:", data);

      return res.status(500).json({ error: "OpenAI failed" });

    }

    return res.status(200).json({

      reply: data.choices[0].message.content

    });

  } catch (err) {

    console.error("SERVER CRASH:", err);

    return res.status(500).json({ error: "Server crashed" });

  }

}
