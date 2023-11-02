const express = require('express');
const router = express.Router();

const Posts = require("../schemas/post.js");



/*
게시글 작성 api
제목, 작성자명, 비밀번호, 작성 내용을 입력하기.
*/

router.post("/posts", async(req, res)=> {
    
    try{
    const{title, username, password, detail} = req.body;

    let isExist = await Posts.findOne({title: String(title), username: String(password)});

    if(isExist) {
        return res.json({message: "게시글 생성 실패"});
    }

    const createPosts = await Posts.create({ title, username, password, detail});
    return res.json({message: "게시글 생성 성공", isExist: createPosts});
    
    } catch (error){
        res.status(500).json({message: "서버 오류 발생", error});
    }
})

/*
게시글 수정 API
API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기.
*/
router.put("/posts", async(req, res) => {
    try{
    const { title, username, password, detail } = req.body;

    let existPosts = await Posts.findOne({title: String(title), password: String(password)});

    if(existPosts) {
        existPosts.detail = detail;
        await existPosts.save()
        return res.json({message: "게시글 업데이트 성공", existPosts: existPosts});
    }else{
        return res.json({message: "게시글이 없습니다."});}
    } catch (error) {
        res.status(500).json({message: "서버 오류 발생", error});
    }
})

/*
게시글 삭제 SAPI
API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기.
*/
router.delete("/posts", async(req, res)=>{
    try{
        const { title, username, password, detail} = req.body;

        let existPosts = await Posts.findOne({title: String(title), password: String(password)});

        if(existPosts){
            await Posts.deleteOne({title});
        }
        return res.json({message: "게시글 삭제 성공"});


    } catch(error){
        res.status(500).json({message : "서버 오류 발생"});
    }
})


/* 
1. 전체 게시글 목록 조회 API
제목, 작성자명, 작성 날짜를 조회하기
작성 날짜 기준으로 내림차순 정렬하기
*/
router.get("/posts", async(req, res)=> {
    try {
        const posts = await Posts.find();
        res.json(posts);
    } catch(error){
        res.status(500).json({message : err.message});
    }
});

/*
게시글 조회 API
제목, 작성자명, 작성 날짜, 작성 내용을 조회하기
*/
router.get("/posts/:username", async(req, res)=> {
    try{const { username } = req.params;

    const userPosts = await Posts.find({ username: String(username)}, {title: 1, username: 1, createAt: 1, detail: 1});

    if (userPosts.length === 0) {
        return res.status(404).json({message : "해당 유저의 게시글 찾을 수 없음."});
    }

    res.json({userPosts});
} catch (error){
    res.status(500).json({message : "서버오류 발생"});
}
});


module.exports = router;