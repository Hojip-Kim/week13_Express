const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 3000;

postsRouter = require('./routes/posts.js');
commentRouter = require('./routes/comment.js');
userRouter = require('./routes/user.js');
loginRouter = require('./routes/login.js');

const connect = require('./schemas');

connect();

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api', [postsRouter, commentRouter, userRouter, loginRouter]);

//로그 관리하는 파일 따로 만들것임.
app.listen(port, () => {
  console.log(port, 'server is opened');
});
