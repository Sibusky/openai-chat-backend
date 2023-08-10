const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const missingAuthError = new Error('There is no authorization header');
    missingAuthError.status = 401;
    return next(missingAuthError);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const unauthorizedError = new Error('Authentication failed');
    unauthorizedError.status = 401;
    res.send(unauthorizedError.message);
    next(unauthorizedError);
  }
  req.user = payload;
  return next();
};
