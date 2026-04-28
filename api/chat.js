export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({ error: "Method not allowed" });

  }

  try {

    const { messages, user_id = "anonymous" } = req.body;

    if (!messages || !Array.isArray(messages)) {

      return res.status(400).json({ error: "Invalid messages" });

    }

    // 🔥 OPENAI CALL

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {

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

Speak like a real human, not a therapist.

Be warm, clear, and emotionally present.

Keep responses SHORT (3–6 sentences max).

No long paragraphs. No over-explaining.

Tone:

- Calm

- Supportive

- Honest

- Thoughtful

Faith:

- Light and natural only when appropriate

Always:

- Acknowledge the user

- Offer ONE insight

- End with a simple question when it fits

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

    const data = await aiResponse.json();

    if (!aiResponse.ok) {

      console.error("OpenAI error:", data);

      return res.status(500).json({ error: "AI failed" });

    }

    const reply = data.choices?.[0]?.message?.content || "I'm here with you.";

    // 🔥 SAVE TO SUPABASE

    try {

      await fetch(`${process.env.SUPABASE_URL}/rest/v1/conversations`, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "apikey": process.env.SUPABASE_ANON_KEY,

          "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`

        },

        body: JSON.stringify({

          user_id,

          messages,

          reply,

          created_at: new Date().toISOString()

        })

      });

    } catch (saveError) {

      console.error("Save failed (non-blocking):", saveError);

    }

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("Server error:", error);

    return res.status(500).json({ error: "Something went wrong" });

  }

}
