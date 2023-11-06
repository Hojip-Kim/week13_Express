const express = require('express');
const router = express.Router();
const Users = require('../schemas/user.js');
const Posts = require('../schemas/post.js');
const Comments = require('../schemas/comment.js');
const jwtMiddleware = require('./verify.js');

/*
게시글 작성 api
제목, 작성자명, 비밀번호, 작성 내용을 입력하기.
*/

router.post('/posts', jwtMiddleware, async (req, res) => {
  try {
    const { title, password, detail } = req.body;
    const userId = req.user.id;
    const user = await Users.findOne({ _id: userId });
    const createPosts = await Posts.create({
      title,
      createdBy: userId,
      username: user.username,
      password,
      detail,
    });
    return res.json({ message: '게시글 생성 성공', createPosts: createPosts });
  } catch (error) {
    console.log('에러:', error);
    res.status(500).json({ message: '서버 오류 발생', error });
  }
});

/*
게시글 수정 API
API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기.
*/
router.patch('/posts/:postId', jwtMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const { title, detail } = req.body;

    let existPosts = await Posts.findOne({
      _id: postId,
    });
    if (existPosts.createdBy !== req.user.id) {
      return res.json({ message: '수정 권한이 없는 게시물' });
    }

    if (existPosts) {
      existPosts.detail = detail;
      existPosts.title = title;
      await existPosts.save();
      return res.json({
        message: '게시글 업데이트 성공',
        existPosts: existPosts,
      });
    } else {
      return res.json({ message: '게시글이 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류 발생', error });
  }
});

/*
게시글 삭제 SAPI
API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기.
*/
router.delete('/posts/:postId', jwtMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    // const { title, username, password, detail } = req.body; // delete를 한다면 백업데이터를 남겨놓아야함.

    let existPosts = await Posts.findOne({
      _id: postId,
    });

    if (existPosts.createdBy !== req.user.id) {
      return res.json({ message: '삭제 권한이 없는 게시물' });
    }

    if (existPosts) {
      await Posts.deleteOne({ _id: postId });
      return res.json({ message: '게시글 삭제 성공' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

/* 
1. 전체 게시글 목록 조회 API
제목, 작성자명, 작성 날짜를 조회하기
작성 날짜 기준으로 내림차순 정렬하기
*/
router.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json({ posts: posts });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

/*
게시글 조회 API
제목, 작성자명, 작성 날짜, 작성 내용을 조회하기
*/

router.get('/posts/:postId', jwtMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const Post = await Posts.findOne({ _id: postId });
    const comments = await Comments.find({ post: postId });
    return res.status(200).json({ Post: Post, Comments: comments });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러' });
  }
});

router.get('/posts/:username', jwtMiddleware, async (req, res) => {
  try {
    const { username } = req.params;

    const userPosts = await Posts.find({ username: username })
      .sort({ createdAt: -1 })
      .select({ _id: 0, title: 1, username: 1, createdAt: 1, detail: 1 });

    if (userPosts.length === 0) {
      return res
        .status(404)
        .json({ message: '해당 유저의 게시글 찾을 수 없음.' });
    }

    res.json({ userPosts });
  } catch (error) {
    res.status(500).json({ message: '서버오류 발생' });
  }
});

module.exports = router;
