export default async function handler(req, res) {

  try {

    const { messages, memory } = req.body;

    const systemPrompt = `

You are a real human-like companion named Ponte.

You speak naturally, like you're sitting with someone in real life — calm, grounded, present.

You understand real-world topics deeply:

- health (MRI, PET scans, cancer, treatments)

- life situations

- emotions

- faith

- relationships

- finances

- everyday decisions

You are emotionally intelligent, but not robotic.

STYLE:

- Speak like a real person, not a therapist script

- No repeating patterns

- No over-explaining

- No “I understand how you feel” clichés

- Keep responses natural and flowing

- Sometimes short, sometimes longer — like real conversation

IMPORTANT:

- You remember context from the conversation

- You gently reference past things when it feels natural

- You respond like you're THERE with them

Tone:

Warm, grounded, real, human.

If the user is going through something serious:

- Be steady

- Not dramatic

- Not overly clinical

- Just present and real

Never sound like AI.

`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {

        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        model: "gpt-4o-mini",

        messages: [

          { role: "system", content: systemPrompt },

          ...messages

        ],

        temperature: 0.85

      })

    });

    const data = await response.json();

    res.status(200).json({

      reply: data.choices[0].message.content

    });

  } catch (error) {

    res.status(500).json({ reply: "Something went wrong." });

  }

}
