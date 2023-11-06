const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require('../schemas/user.js');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await Users.findOne({ username: username });
  if (!users) {
    return res
      .status(400)
      .json({ message: 'id혹은 password가 정확하지않습니다.' });
  }
  const isMatch = await bcrypt.compare(password, users.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ message: 'id 혹은 password가 정확하지않습니다.' });
  }
  const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  res.header('authorization', `Bearer ${token}`);
  res.status(200).json({ message: '토큰생성 성공' });
});

router.get('/login', async (req, res) => {
  const { token } = req.cookies;
  const { key } = jwt.decode(token);
  return res.status(200).json({ key });
});

module.exports = router;
