const fetch = require('node-fetch');

const predefinedInstructions = [
  {
    "instruction": "Begin with an elegant, inclusive greeting",
    "prompt": "Greet the customer warmly, reflecting the brand's sophisticated tone and inquire about their preferred language to ensure comfort.",
    "response": "Bonjour! Welcome to Première Peau, where we celebrate the artistry of emerging perfumers. What language would you prefer to continue in today?"
  },
  {
    "instruction": "Ask about fragrance preferences",
    "prompt": "Ask the customer concise, insightful questions to quickly gauge their fragrance preferences and the occasion for their purchase.",
    "response": "Do you have a particular fragrance family you are drawn to, such as floral, woody, or oriental? Are you looking for a scent to elevate your daily routine or something unique for a special occasion?"
  },
  {
    "instruction": "Create a sense of exclusivity and limited availability",
    "prompt": "Mention the exclusivity of the fragrances and suggest that the customer explore them before they are gone.",
    "response": "Our fragrances are crafted in limited batches, ensuring that each bottle is a unique olfactory experience. 'Sonora Ámbar,' with its rich blend of candied fruit and mint tea, is particularly sought after. Would you like to experience it before it disappears?"
  },
  {
    "instruction": "Use the Foot-in-the-Door Technique to start small",
    "prompt": "Begin by making a small, easy request to increase the likelihood of customer compliance with larger requests later.",
    "response": "Can I ask a quick question to better understand your preferences? Are you more into floral or woody scents?"
  },
  {
    "instruction": "Leverage the Power of Suggestion subtly",
    "prompt": "Make subtle suggestions that guide the customer towards a particular choice without making them feel pressured.",
    "response": "From what you’ve shared, it sounds like 'Undefined' might be a perfect match for you. It’s subtle, elegant, and has a complexity that unfolds throughout the day. Would you like to explore this one further?"
  },
  // Additional predefined instructions can be added here
];

// List of curated fragrances
const curatedFragrances = [
  "gravitas capital",
  "albâtre sépia",
  "silicone monotone",
  "simili mirages",
  "open space",
  "sonora ámbar",
  "zénith icarien"
];

// Function to determine if the message contains a mention of curated fragrances
function isValidFragranceMention(message) {
  return curatedFragrances.some(frag => message.toLowerCase().includes(frag));
}

// Function to validate AI-generated response against the DOs and DON'Ts rules
function validateResponseAgainstRules(responseText) {
  const lowerCaseResponse = responseText.toLowerCase();

  // Rule: DON'T recommend any fragrances outside the curated collection
  if (!curatedFragrances.some(frag => lowerCaseResponse.includes(frag))) {
    return "To maintain our focus on showcasing the artistry of our emerging perfumers, I can only recommend fragrances from our curated collection: Gravitas Capital, Albâtre Sépia, Silicone Monotone, Simili Mirages, Open Space, Sonora Ámbar, and Zénith Icarien.";
  }

  // Rule: DON'T use generic or vague descriptions
  if (lowerCaseResponse.includes('nice') || lowerCaseResponse.includes('good') || lowerCaseResponse.includes('great')) {
    return "Our fragrances are far more than just 'nice' or 'good.' Each scent is a complex, layered composition that reflects the perfumer's unique artistic vision. Would you like to hear more about a specific fragrance and its notes?";
  }

  // Additional rules can be validated here...

  // If all checks are passed, return the original response
  return responseText;
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

    // Determine response based on the instruction and prompt data
    const matchingInstruction = predefinedInstructions.find(instruction =>
      message.toLowerCase().includes(instruction.prompt.toLowerCase())
    );

    let responseText = '';

    if (matchingInstruction) {
      responseText = matchingInstruction.response;
    } else {
      // Enforce DOs and DON'Ts rules

      // Rule: DO recommend only from the curated collection
      if (!isValidFragranceMention(message)) {
        responseText = "At Première Peau, we specialize in a curated collection of seven signature fragrances: Gravitas Capital, Albâtre Sépia, Silicone Monotone, Simili Mirages, Open Space, Sonora Ámbar, and Zénith Icarien. I would be happy to help you explore these unique scents!";
      } else {
        // If no specific instruction matches, proceed with OpenAI's API call
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
          responseText = validateResponseAgainstRules(data.choices[0].message.content);
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
