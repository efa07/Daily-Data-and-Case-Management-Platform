const jwt = require('jsonwebtoken');

const authMiddleware = (role) => {
  return (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Token required");

    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err || decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    });
  };
};

module.exports = authMiddleware;
