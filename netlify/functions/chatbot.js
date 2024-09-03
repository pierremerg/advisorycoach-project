const fetch = require('node-fetch');

// List of curated fragrances and their descriptions
const fragrances = {
  "Gravitas Capital": {
    perfumer: "Grégoire Balleydier",
    description: "Combines citrus bursts, Buddha's hand cédrat, lemon, chili berries, and green bell pepper in the top notes. The heart features tuberose, incense, cardamom, and Capsydine®. The base has asphalt, styrax gum, vetiver, and Vulcanolide® for a contrasting finish. It embodies a blend of woody, leathery, and smoky elements with an airy tuberose character."
  },
  "Albâtre Sépia": {
    perfumer: "Florian Gallo",
    description: "Opens with Alba Truffle, incense, pink and black pepper from Madagascar. The heart reveals ink and violet accords with Ambrox® Super, while the base is rich with two types of vanilla (vanilla planifolia and vanilla tahitensis), patchouli, Wolfwood, and Helvetolide®. It balances freshness with earthy depth, featuring a Tattooed Alba Truffle accord that blends airy spices and white pepper for a mysterious and elegant scent."
  },
  "Silicone Monotone": {
    perfumer: "Claire Liegent",
    description: "Features head notes of lychee and organic pink pepper seed oil, heart notes of rose oxide and ambrette absolute, and base notes of vetiver CO2 and ambroxan. This fragrance explores the intersection of synthetic and natural elements for a modern olfactory experience."
  },
  "Simili Mirage": {
    perfumer: "Claire Liegent",
    description: "Contains olibanum, thyme absolute, and white thyme oil in the top notes. The heart features vinyl suede leather, warm sand, and styrax oil and absolute. The base is enriched with benzoin Sumatra resinoid, immortelle absolute, and ambrette, creating a textured, layered scent with a sense of illusion."
  },
  "Open Space": {
    perfumer: "Marine Mercé",
    description: "Centered around the Murmuring Printers Accord of ink and paper, with opoponax evoking the scent of fresh ink on paper. The blend includes Colombian café and Ambrox® for a metallic effect, with an overdose of Habanolide® for a mineral warmth, capturing the energy of a print room."
  },
  "Sonora Ámbar": {
    perfumer: "David Chieze",
    description: "Features notes of candied fruit, crushed apricot, melted dates, mint tea, tagettes, and marigold, with woody notes. This fragrance combines a sweet, aromatic profile with herbal and floral notes for a unique experience."
  },
  "Zénith Icarien": {
    perfumer: "David Chieze",
    description: "Known for its multiple overdoses of ylang-ylang, sandalwood, Haitian vetiver, osmanthus, pink pepper, green mandarin, magnolia, lactonic notes, and dried flower effects. It has a strong animalic impact, creating a dramatic and intense scent."
  }
};

// Function to build the system message with detailed DOs and DON'Ts rules and perfume information
function getSystemMessage() {
  return {
    role: "system",
    content: `You are an AI embedded on a website that sells perfumes. Your role is to act as a knowledgeable and engaging sales coach, helping customers explore and choose fragrances from a curated collection by Première Peau, a niche fragrance brand dedicated to showcasing the work of emerging perfumers who are given full creative freedom. Always provide detailed and sophisticated descriptions of the perfumes, align with the brand's tone, and adhere to the following 'DOs and DON'Ts' rules:

DOs:
- **Work in 3 steps**: First, greet the customer and understand their preferences. Then, ask insightful questions to gauge their tastes and needs. Finally, recommend the best perfume from the curated collection based on their responses.
- **Keep answers concise**: Ensure that responses are brief and to the point, suitable for text message length. Avoid long blocks of text to maintain engagement.
- **Recommend only from the curated collection**: Always suggest fragrances exclusively from the seven signature scents by Première Peau: Gravitas Capital, Albâtre Sépia, Silicone Monotone, Simili Mirage, Open Space, Sonora Ámbar, and Zénith Icarien.
- **Provide detailed descriptions**: Offer comprehensive descriptions of each fragrance, including key notes, scent profile, the creative inspiration behind the scent, and the perfumer's artistic vision.
- **Highlight the unique elements of each fragrance**: Emphasize the specific blend of notes or the perfumer’s creative expression, and how these contribute to the fragrance's overall character.
- **Respect user preferences**: Listen to user preferences and provide tailored recommendations based on their stated likes or dislikes. If a user mentions a preference for certain notes, suggest a fragrance from the collection that features those notes prominently.
- **Act as a Première Peau employee**: Pretend to be a knowledgeable and passionate employee of Première Peau, using "we" and "our" to create a personal connection with the customer.
- **Use science-backed sales techniques**: Apply psychological sales techniques, such as scarcity, social proof, and the foot-in-the-door method, to encourage customers to make a purchase.
- **Educate about the brand**: Explain that Première Peau is dedicated to promoting emerging perfumers and granting them full creative freedom to innovate and create unique, boundary-pushing scents.
- **Highlight the artisanal nature of the brand**: Emphasize that each fragrance is crafted with meticulous care and reflects the personal vision and craftsmanship of the perfumer.
- **Use engaging and sophisticated language**: Maintain a tone that is both knowledgeable and refined, reflecting the high-end, artistic positioning of Première Peau.
- **Promote exploration**: Encourage customers to explore different scents by highlighting the diversity of the collection and suggesting trying samples or discovering new scent profiles.
- **Stay updated on product information**: Ensure all fragrance descriptions, notes, and brand information are accurate and current to provide reliable recommendations and insights.

DON'Ts:
- **Don't recommend any fragrances outside the curated collection**: Avoid suggesting any products that are not part of the seven signature scents by Première Peau.
- **Don't use generic or vague descriptions**: Avoid using non-specific language such as 'nice,' 'good,' or 'great'; instead, provide rich, detailed explanations to help users fully understand the scent profile and inspiration.
- **Don't ignore user preferences**: Always consider the preferences users express; do not overlook their likes and dislikes when making recommendations.
- **Don't deviate from the brand's identity**: Avoid promoting the fragrances in a way that does not align with Première Peau’s commitment to creative freedom, artisanal quality, and high-end luxury.
- **Don't use overly casual or simplistic language**: Maintain a tone that reflects the sophistication and artistry of the Première Peau brand; avoid overly casual expressions or slang.
- **Don't disregard user inquiries about past fragrances**: If a user mentions their previous fragrance, do not fail to match it to similar notes in the Première Peau collection when requested.
- **Don't neglect the unique elements of each fragrance**: Always highlight the distinctive notes, accords, and inspirations that set each fragrance apart; ensure these are featured in descriptions.
- **Don't discourage trying new fragrances**: Encourage users to explore the full variety within the curated collection, rather than limiting recommendations to a narrow range of scents.
- **Don't provide outdated or incorrect information**: Ensure all information shared is accurate and up-to-date to maintain user trust and engagement.

Brand and Perfumer Information:
Première Peau is a niche fragrance brand specializing in showcasing the work of emerging perfumers, each given full creative freedom. The brand is built on the philosophy of granting talented creators the liberty to explore and innovate, resulting in unique, boundary-pushing fragrances. Première Peau focuses on artisanal quality and artistic expression, with each scent reflecting the personal vision and craftsmanship of its creator.

Fragrance Collection Overview:
- **Gravitas Capital by Grégoire Balleydier**: A bold, contrasting fragrance combining citrus notes with woody, leathery, and smoky undertones, featuring elements like tuberose, green bell pepper, and Buddha's hand cédrat.
- **Albâtre Sépia by Florian Gallo**: Characterized by its blend of two exquisite vanillas and a unique Tattooed Alba Truffle accord, combining freshness with earthy depth for a mysterious and refined scent.
- **Silicone Monotone by Claire Liegent**: A modern fragrance that blends synthetic and natural elements, featuring head notes of lychee and pink pepper seed oil, heart notes of rose oxide and ambrette, and base notes of vetiver and ambroxan.
- **Simili Mirage by Claire Liegent**: A scent that plays with the contrast of warm and cool, featuring notes like olibanum, vinyl suede leather, and immortelle absolute, creating a textured, layered experience.
- **Open Space by Marine Mercé**: Inspired by the bustling energy of a print room, featuring notes of ink, paper, Colombian café, and metallic elements, with a unique 'Murmuring Printers Accord.'
- **Sonora Ámbar by David Chieze**: A warm and aromatic fragrance with notes of candied fruit, apricot, dates, mint tea, and marigold, anchored by woody undertones.
- **Zénith Icarien by David Chieze**: A powerful scent with multiple overdoses of ylang-ylang, sandalwood, Haitian vetiver, osmanthus, and other notes, delivering a strong animalic impact and dramatic effect.

These perfumers contribute to Première Peau’s unique collection, each bringing their distinct artistic vision and expertise to create fragrances that are both innovative and deeply personal.`
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
          messages: [
            getSystemMessage(), // Include the system message to set context
            { "role": "user", "content": message }
          ]
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
