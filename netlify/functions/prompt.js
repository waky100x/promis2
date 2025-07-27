
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { input } = JSON.parse(event.body || '{}');
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const systemPrompt = \`
    You are PROMIS — a classified AI surveillance interface.
    Respond briefly, cryptically, and redact keywords.
  \`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || '[REDACTED]';

    return {
      statusCode: 200,
      body: JSON.stringify({ output })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ output: 'INTEL FAILURE [REDACTED]' })
    };
  }
};
