const express = require('express');
const router = express.Router();

const Users = require('../schemas/user.js');

const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

router.post('/user', async (req, res) => {
  const { username, password, checkPassword, nickname } = req.body;

  const user = await Users.findOne({ username: username });
  if (user) {
    return res.status(400).json({ message: '중복된 닉네임입니다.' });
  }
  if (
    validateNickname(nickname) &&
    validatePassword(nickname, password, checkPassword)
  ) {
    const hashedPassword = await hashPassword(password);
    const createUsers = await Users.create({
      username,
      password: hashedPassword,
      nickname,
    });
    return res
      .status(200)
      .json({ message: '유저 회원가입 성공', User: createUsers });
  } else {
    return res.status(400).json({ message: '별명과 비밀번호를 확인해주세요.' });
  }
});

function validateNickname(nickname) {
  const hasLetters = /[A-Za-z]/.test(nickname);
  const hasNumbers = /[\d]/.test(nickname);
  const isValidLength = nickname.length >= 3;

  return hasLetters && hasNumbers && isValidLength;
}

function validatePassword(nickname, password, checkPassword) {
  const isValidLnegth = password.length >= 4;
  const isSameWithNickname = nickname != password;
  const isPasswordMatch = password == checkPassword;

  return isValidLnegth && isSameWithNickname && isPasswordMatch;
}

module.exports = router;
