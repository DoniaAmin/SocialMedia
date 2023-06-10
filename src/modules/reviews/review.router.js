const express = require('express');
const router = express.Router();
const verifyToken = require('../../../utils/verifyToken');
const { getAllReview, addReview, getPostReview, updateReview, deletReview, getUserReview } = require('./review.controller');


router.get('/', verifyToken, getAllReview)
router.get('/:id', verifyToken, getPostReview)
router.get('/user/:id', verifyToken, getUserReview)
router.post('/:id', verifyToken, addReview)
router.patch('/:id', verifyToken, updateReview)
router.delete('/:id', verifyToken, deletReview)

module.exports = router;