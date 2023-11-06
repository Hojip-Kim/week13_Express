const express = require('express');
const router = express.Router();
const Users = require('../schemas/user.js');
const Comments = require('../schemas/comment.js');
const jwtMiddleware = require('./verify.js');

/*
댓글 목록 조회
1. 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기.
2. 작성 날짜 기준으로 내림차순 정렬하기.
*/

router.get('/posts/:postId/comments', jwtMiddleware, async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comments.find({ post: postId })
      .sort('-createdAt')
      .exec();
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

//create
router.post('/posts/:postId/comments', jwtMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { detail } = req.body;
  const userId = req.user.id;
  const User = await Users.findOne({ _id: userId });
  try {
    if (!detail || detail.length === 0) {
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    } else {
      const newComment = await Comments.create({
        post: postId,
        createdBy: userId,
        username: User.username,
        detail: detail,
      });
      res.status(200).json({ message: newComment });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '댓글 생성 실패' });
  }
});

// update
router.patch(
  '/posts/:postId/comments/:commentId',
  jwtMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { detail } = req.body;
    try {
      const comments = await Comments.findOne({
        _id: commentId,
        post: postId,
      }).exec();

      if (comments.createdBy !== req.user.id) {
        return res.json({ message: '해당 댓글에 대한 권한이 없습니다.' });
      }

      if (!comments) {
        res.status(400).json({ message: '해당 댓글이 없습니다.' });
      } else {
        comments.detail = detail;
        await comments.save();
        res.status(200).json({
          message: '댓글이 업데이트 되었음.',
          updatedComment: comments,
        });
      }
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.delete(
  '/posts/:postId/comments/:commentId',
  jwtMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;

    try {
      const comments = await Comments.findOne({
        post: postId,
        _id: commentId,
      }).exec();

      if (comments.createdBy !== req.user.id) {
        return res.json({ message: '해당 댓글의 삭제에대한 권한이 없습니다.' });
      }

      if (!comments) {
        res.status(400).json({ message: '해당 댓글이 없습니다.' });
      } else {
        await Comments.deleteOne({ post: postId, _id: commentId });
        return res.json({message : "댓글 삭제 완료"});
      }
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
