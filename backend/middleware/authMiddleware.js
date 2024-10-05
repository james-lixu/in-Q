const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']; 
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided or malformed token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET); 
    req.user = decoded;  
    next(); 
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    console.error('Invalid token:', err);
    return res.status(401).json({ error: 'Invalid token, authorization denied' });
  }
};

module.exports = authMiddleware;
