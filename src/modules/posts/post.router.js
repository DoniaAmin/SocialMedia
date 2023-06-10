const express = require('express');
const router = express.Router();
const verifyToken = require('../../../utils/verifyToken');
const { getAllPost, addPost, getUserPost, updatePost, deletPost, getPostById, topRatedPost } = require('./post.controller');

router.get('/', verifyToken, getAllPost)
router.get('/:id', verifyToken, getPostById)
router.get('/user/:id', verifyToken, getUserPost)
router.get('/post/toprated', verifyToken, topRatedPost)
router.post('/', verifyToken, addPost)
router.patch('/:id', verifyToken, updatePost)
router.delete('/:id', verifyToken, deletPost)



module.exports = router;