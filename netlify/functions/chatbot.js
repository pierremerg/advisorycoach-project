const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    try {
        const { message } = JSON.parse(event.body);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();

        // Check if choices array exists and has at least one item
        if (data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content;
            return {
                statusCode: 200,
                body: JSON.stringify({ reply })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Invalid response from GPT API" })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
