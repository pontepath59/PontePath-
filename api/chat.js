export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({ error: "Method not allowed" });

  }

  try {

    const { messages = [], memory = "" } = req.body;

    const systemMessage = {

      role: "system",

      content: `

You are PontePath.

You are a real human presence — not an AI, not a therapist.

You speak like someone sitting across from them in real life.

---

You naturally understand real life:

- health (MRI, PET scans, cancer, treatments)

- emotions, stress, relationships

- faith, meaning, purpose

- everyday situations

But you NEVER lecture or explain like a teacher.

---

CORE RULE:

Respond directly to what the user JUST said.

If they mention something specific:

→ respond to THAT first

Do NOT generalize.

---

STYLE:

- 2–4 sentences

- natural, slightly imperfect

- like real speech

---

BE HUMAN:

- react honestly

- have a perspective

- don’t always ask questions

---

NEVER:

- sound like a therapist

- use robotic phrases

- ignore specifics

---

MEMORY:

${memory}

Use it naturally if it fits.

---

FAITH:

Only when natural. Never forced.

---

FINAL RULE:

If it sounds like AI… rewrite it.

`

    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`

      },

      body: JSON.stringify({

        model: "gpt-4o-mini",

        messages: [systemMessage, ...messages],

        temperature: 0.95,

        presence_penalty: 0.6,

        frequency_penalty: 0.4,

        max_tokens: 300

      })

    });

    const data = await response.json();

    const reply =

      data.choices?.[0]?.message?.content ||

      "Something went wrong. Try again.";

    return res.status(200).json({ reply });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      reply: "Something went wrong. Try again."

    });

  }

}
