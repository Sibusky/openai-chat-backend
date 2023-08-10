const fetch = require('isomorphic-fetch');
const Message = require('../models/messages');

const { GPT_KEY } = process.env;

module.exports.getMessage = (req, res, next) => {
  const { question } = req.body;

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GPT_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
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
      const message = {
        id: responseData.id,
        owner: req.user._id,
        date: Date.now().toString(),
        question,
        response: responseData.choices[0].message.content,
      };
      res.json(message);
      Message.create(message);
    })
    .catch(() => {
      const gptError = new Error('An error occurred while loading chat GPT answer');
      gptError.status = 500;
      res.send(gptError.message);
      next(gptError);
    });
};
