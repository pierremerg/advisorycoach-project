const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const { message } = JSON.parse(event.body);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`  // Replace with your OpenAI API Key
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": message }]
        })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return {
        statusCode: 200,
        body: JSON.stringify({ reply })
    };
};
