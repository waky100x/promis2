
async function askPROMIS() {
  const input = document.getElementById('query').value;
  const responseBox = document.getElementById('response');
  responseBox.textContent = 'Scanning...';

  try {
    const res = await fetch('/.netlify/functions/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });

    const data = await res.json();
    responseBox.textContent = data.output || '[REDACTED]';
  } catch (error) {
    responseBox.textContent = 'SYSTEM FAILURE: INTEL STREAM INTERRUPTED.';
  }
}
