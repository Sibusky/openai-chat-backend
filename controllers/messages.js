const fetch = require('isomorphic-fetch');
const Message = require('../models/messages');

const { GPT_KEY } = process.env;

module.exports.postMessage = (req, res, next) => {
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
        _id: responseData.id,
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

module.exports.getAllMessages = (req, res, next) => {
  Message.find({ owner: req.user._id })
    .then((message) => res.status(200).send(message))
    .catch(next);
};

module.exports.deleteMessage = (req, res, next) => {
  Message.findById(req.params._id)
    .then((message) => {
      if (!message) {
        throw new Error('This message does not exist');
      } else if (message.owner.toString() !== req.user._id) {
        throw new Error('You can delete only ours message');
      }
      return message.deleteOne().then(res.status(200).send({ message: `Answer from ${message.date} was deleted` }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error('Incorrect message data'));
      } else {
        next(err);
      }
    });
};
