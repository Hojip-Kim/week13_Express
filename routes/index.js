const express = require('express');
const router = express.Router();

const Posts = require("../schemas/post.js");


router.post("/posts", async(req, res)=> {
    const{title, username, password, detail} = req.body;

    const createPosts = await Posts.create({ title, username, password, detail});

    res.json({ posts: createPosts });
})

router.get("/")

module.exports = router;