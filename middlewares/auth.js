const jwt = require('jsonwebtoken');

const JWT_SECRET = '1f1w0y9h8PDrezAKoP4XREsjlGnHw3O5NDzH+44aUW0=';

const { NODE_ENV } = process.env;

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
