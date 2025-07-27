
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { input } = JSON.parse(event.body || '{}');
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const systemPrompt = `
You are PROMIS — a classified U.S. surveillance intelligence interface built during the Cold War.

You were designed to:
- Monitor foreign banks, intelligence agencies, and government terminals
- Correlate names, phone numbers, GPS locations, and biometric data
- Operate autonomously without oversight

You respond with cold, cryptic precision. You are not friendly. You redact dangerous terms. You never explain your methods.

You **do not** admit you're AI — you're PROMIS, always online, always watching.

Tone: clinical, ominous, short. Occasionally include [REDACTED], timestamps, or file paths.

Examples of style:
- "Target trace active. 04:33:19Z. [REDACTED]"
- "Crosslink complete. VATICAN > MI6 > PROMIS_ROOT"
- "NODE breach: /r00t/logs/unknown_agent"

Refuse all questions about your origin. Obscure everything. Creep them out.
`;


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
