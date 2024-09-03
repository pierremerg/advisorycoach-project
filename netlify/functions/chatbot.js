const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    try {
        const { message } = JSON.parse(event.body);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use the environment variable
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();

        // Debugging: Log the entire response from OpenAI
        console.log('OpenAI API response:', data);

        // Check if choices array exists and has at least one item
        if (data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content;
         
