const router = require('express').Router();
const fetch = require('isomorphic-fetch');
const auth = require('../middlewares/auth');

const { GPT_KEY } = process.env;

router.post('/chat', (req, res) => {
  const { message } = req.body;

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GPT_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((responseData) => {
      const aiResponse = responseData.choices[0].message.content;
      res.json({ response: aiResponse });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred.' });
    });
});

module.exports = router;
