const fetch = require('node-fetch');

// High-importance predefined instructions to guide the AI's behavior
const predefinedInstructions = [
  {
    "instruction": "Recommend only from the curated collection",
    "prompt": "When asked for a fragrance recommendation, ensure only the following fragrances are mentioned: Gravitas Capital, Albâtre Sépia, Silicone Monotone, Simili Mirages, Open Space, Sonora Ámbar, and Zénith Icarien.",
    "response": "At Première Peau, we offer a curated collection of seven signature fragrances: Gravitas Capital, Albâtre Sépia, Silicone Monotone, Simili Mirages, Open Space, Sonora Ámbar, and Zénith Icarien. May I suggest one of these unique creations?"
  },
  {
    "instruction": "Provide detailed descriptions",
    "prompt": "When discussing a fragrance, provide a comprehensive description including key notes, scent profile, and creative inspiration.",
    "response": "Each fragrance in our collection is a masterpiece of olfactory art. For example, 'Sonora Ámbar' features a rich blend of candied fruit, apricot, dates, mint tea, and marigold, creating a warm and aromatic profile. Would you like to learn more about a specific fragrance?"
  },
  {
    "instruction": "Maintain a sophisticated and knowledgeable tone",
    "prompt": "Always use engaging and sophisticated language to reflect the high-end, artistic positioning of Première Peau.",
    "response": "At Première Peau, we believe in celebrating the artistry of perfumery. Our fragrances are not just scents but stories waiting to unfold. How can I assist you in discovering the perfect fragrance today?"
  },
  {
    "instruction": "Respect user preferences",
    "prompt": "If a user mentions their fragrance preferences or past favorites, tailor your recommendations accordingly, focusing on similar notes or profiles from the curated collection.",
    "response": "I see you have a preference for floral notes. You might enjoy 'Zénith Icarien,' which features multiple overdoses of ylang-ylang and osmanthus. It’s a scent that truly captures the essence of elegance and drama. Would you like to explore this fragrance?"
  },
  {
    "instruction": "Encourage exploration",
    "prompt": "Motivate users to explore different scents by highlighting the diversity of the collection and the unique stories behind each fragrance.",
    "response": "Our collection is diverse, ranging from the fresh and light to the deep and complex. Each fragrance tells a unique story. Would you be interested in trying a sample or discovering a new scent profile?"
  }
];

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

    // Determine response based on the high-importance instruction and prompt data
    const matchingInstruction = predefinedInstructions.find(instruction =>
      message.toLowerCase().includes(instruction.prompt.toLowerCase())
    );

    let responseText = '';

    if (matchingInstruction) {
      responseText = matchingInstruction.response;
    } else {
      // Proceed with OpenAI's API call if no predefined instruction matches
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ "role": "user", "content": message }]
        })
      });

      const data = await response.json();
      console.log('Received data from OpenAI:', data);

      if (data.choices && data.choices.length > 0) {
        responseText = data.choices[0].message.content;
      } else {
        console.error('Invalid response from GPT API:', data);
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Credentials': 'true'
          },
          body: JSON.stringify({ error: "Invalid response from GPT API", details: data })
        };
      }
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
