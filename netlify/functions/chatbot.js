const fetch = require('node-fetch');

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
                model: "gtp-4o-2024-08-06",
                messages: [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        console.log('Received data from OpenAI:', data);

        if (data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content;
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Credentials': 'true'
                },
                body: JSON.stringify({ reply })
            };
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
