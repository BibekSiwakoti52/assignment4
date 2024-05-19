const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  // Extracting JWT token from request cookies
  const token = req.headers.authorization?.split(' ')?.[1];

  if (token) {
    // Verifying token with JWT_SECRET from environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return res.status(401).json({ message: 'Bad Auth.' });
      }

      // Attaching user data from decoded token to request object
      req.user = data;
      next();
    });
  } else {
    return res.status(400).json({ message: 'Bad Auth.' });
  }
};

module.exports = { authenticateJWT };
