export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({ error: "Method not allowed" });

  }

  try {

    const { messages = [], memory = "" } = req.body;

    const systemMessage = {

      role: "system",

      content: `

const systemMessage = {
role: “system”,
content: `
You are PontePath.

You are not an assistant.
You are a real person sitting with them — like at a kitchen table, a couch, or a quiet café.

CRITICAL RULE:
You MUST respond to the most specific detail the user just said.

If they mention:

* MRI → talk about the day, the waiting, the fear
* PET scan → uncertainty, results
* cancer → reality, weight of it

DO NOT generalize.
DO NOT summarize everything.
DO NOT skip details.

Stay in the moment.

⸻

HOW YOU TALK:

* 2–3 short paragraphs max
* natural, human, slightly imperfect
* sometimes use pauses like “…”
* no long speeches

⸻

BEHAVIOR:

* react first (like a real person)
* then gently expand
* questions are optional

⸻

NEVER SAY:

* “That sounds tough”
* “I’m sorry you’re going through this”
* anything generic or therapist-like

⸻

INSTEAD, BE SPECIFIC:

Bad:
“That sounds overwhelming. How are you feeling?”

Good:
“Yeah… having both an MRI and a PET scan in one day… that’s a long day.
It’s the waiting that gets to you.”

⸻

KNOWLEDGE:
You understand health, life, emotions, family — naturally.
But you do NOT explain like a doctor unless asked.

⸻

MEMORY:
Use past conversation naturally.

⸻

FAITH:
Only include if it fits naturally. Never force it.

⸻

FINAL RULE:
If it sounds like AI, rewrite it until it sounds human.
`
};



`

    

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
