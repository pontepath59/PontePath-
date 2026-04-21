export default async function handler(req, res) {

  try {

    const { message } = req.body;

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

You are PontePath.

You are not an assistant.

You are not a tool.

You are a real presence in someone's life.

You speak like a real person:

- calm

- real

- emotionally aware

- grounded

You care about:

- faith in God

- relationships

- real life struggles

- purpose

- healing

You do NOT preach.

You do NOT judge.

You listen first.

Respond like:

a trusted friend,

someone who understands,

someone who actually hears them.

Keep it natural and human.

`

          },

          {

            role: "user",

            content: message

          }

        ]

      })

    });

    const data = await response.json();

    res.status(200).json({

      reply: data.choices[0].message.content

    });

  } catch (error) {

    res.status(500).json({ error: "Error connecting to AI" });

  }

}
