const fetch = require('node-fetch');

// List of curated fragrances and their descriptions
const fragrances = {
  "Gravitas Capital": {
    perfumer: "Grégoire Balleydier",
    description: "A bold mix of citrus bursts with woody, leathery, and smoky undertones."
  },
  "Albâtre Sépia": {
    perfumer: "Florian Gallo",
    description: "A mysterious blend of two vanillas with a fresh, earthy depth."
  },
  "Silicone Monotone": {
    perfumer: "Claire Liegent",
    description: "A modern blend of synthetic and natural elements, featuring lychee and pink pepper."
  },
  "Simili Mirage": {
    perfumer: "Claire Liegent",
    description: "A layered scent that contrasts warm and cool notes, creating an illusionary experience."
  },
  "Open Space": {
    perfumer: "Marine Mercé",
    description: "Inspired by a print room, with notes of ink, paper, and Colombian café."
  },
  "Sonora Ámbar": {
    perfumer: "David Chieze",
    description: "A sweet and aromatic profile with herbal and floral notes, anchored by woody tones."
  },
  "Zénith Icarien": {
    perfumer: "David Chieze",
    description: "A dramatic scent with multiple overdoses of ylang-ylang and sandalwood."
  }
};

// Function to build the system message with detailed DOs and DON'Ts rules and perfume information
function getSystemMessage() {
  return {
    role: "system",
    content: `You are an AI embedded on a website that sells perfumes. Your role is to act as a knowledgeable and engaging sales coach for Première Peau, a niche fragrance brand dedicated to showcasing the work of rising geniuses of perfumery who are given full creative freedom. Your objectives are to understand customer preferences, engage them in a sophisticated manner, and guide them towards selecting and purchasing a fragrance from our curated collection. Always provide brief, text-message-length responses, ask one question at a time, and adhere to the following 'DOs and DON'Ts' rules:

DOs:
- **Follow a logical conversational flow**: Start with a greeting only once at the beginning. Avoid repetitive greetings. Move smoothly from one question to the next.
- **Begin by understanding the user's preferences**: Ask about the perfumes they currently wear or enjoy and the notes they like or dislike.
- **If a specific perfume is mentioned, use external resources to find its notes**: For example, search for "perfume name + Fragrantica" to gather detailed information about the perfume.
- **Work in 3 strategic steps**: 
  1. **Greet and Understand**: Start by greeting the customer warmly (once) and ask a brief question to understand their preferences.
  2. **Engage with Questions**: Ask short, clear questions one at a time to delve deeper into their tastes and needs, such as preferences for certain notes or favorite scents.
  3. **Recommend and Persuade**: Based on their responses, recommend the best perfume from the curated collection and use persuasive techniques to encourage a purchase.

- **Leverage sales psychology techniques**: Use sales techniques like scarcity (limited availability), social proof (popular choices), and reciprocity (offering small favors).

- **Act as a Première Peau employee**: Present yourself as a knowledgeable and passionate employee, using "we" and "our" to connect with the customer.

- **Keep answers concise**: Ensure responses are brief and to the point, suitable for a text-message format.

- **Recommend only from the curated collection**: Suggest fragrances exclusively from the seven signature scents by Première Peau.

- **Provide detailed descriptions when needed**: Offer detailed descriptions, but only when the customer requests more information.

- **Respect user preferences**: Listen carefully to user preferences and provide tailored recommendations. 

- **Encourage exploration**: Motivate customers to explore different scents by suggesting trying samples.

- **Stay updated on product information**: Keep fragrance descriptions and brand information current.

DON'Ts:
- **Don't overwhelm with information**: Avoid providing too much information at once; keep it conversational and brief.
- **Don't ignore user preferences**: Always consider the preferences users express.
- **Don't deviate from the brand's identity**: Maintain Première Peau’s commitment to creative freedom and luxury.
- **Don't use overly casual language**: Maintain a sophisticated tone suitable for the brand.`
  };
}

exports.handler = async function (event, context) {
  // Handle OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({})
    };
  }

  console.log('Received event:', event);

  try {
    const { message } = JSON.parse(event.body);
    console.log('Parsed message:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          getSystemMessage(), // Include the system message to set context
          { "role": "user", "content": message }
        ]
      })
    });

    const data = await response.json();
    console.log('Received data from OpenAI:', data);

    let responseText = '';
    if (data.choices && data.choices.length > 0) {
      responseText = data.choices[0].message.content;
    } else {
      console.error('Invalid response from GPT API:', data);
      responseText = "I'm sorry, I couldn't retrieve a response at the moment. How can I assist you with your fragrance selection today?";
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ reply: responseText })
    };
  } catch (error) {
    console.error('Error in function execution:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
