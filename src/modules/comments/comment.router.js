const express = require('express');
const router = express.Router();
const verifyToken = require('../../../utils/verifyToken');
const { getAllComment, addComment, getPostComment, updateComment, deletComment, getUserComment } = require('./comment.controller');


router.get('/', verifyToken, getAllComment)
router.get('/:id', verifyToken, getPostComment)
router.get('/user/:id', verifyToken, getUserComment)
router.post('/:id', verifyToken, addComment)
router.patch('/:id', verifyToken, updateComment)
router.delete('/:id', verifyToken, deletComment)

module.exports = router;