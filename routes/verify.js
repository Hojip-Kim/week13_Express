const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }
  try {
    const tokenBody = token.split(' ')[1];
    const decoded = jwt.verify(tokenBody, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰' });
  }
};

module.exports = jwtMiddleware;
