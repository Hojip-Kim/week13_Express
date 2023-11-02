const express = require('express');
const app = express();
const port = 3000;

postsRouter = require("./routes/posts");
commentRouter = require("./routes/comment");
const connect = require("./schemas");

connect();

app.use(express.json());

app.use(express.static('public'));

app.use("/api", [postsRouter]);

//로그 관리하는 파일 따로 만들것임.
app.listen(port, () => {
    console.log(port, "server is opened");
})