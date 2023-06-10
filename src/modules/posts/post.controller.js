const commentModel = require("../../../models/comment");
const postModel = require("../../../models/post");
const reviewModel = require("../../../models/review");
const userModel = require("../../../models/user");
const AppError = require('../../../utils/AppError');

const getAllPost = async (req, res, next) => {
    const posts = await postModel.find().populate([{ path: 'creator', select: '_id username email role' }, { path: 'comments', select: '-__v ' }, { path: 'reviews', select: '-__v ' }]).select('-__v')
    res.status(200).json({ message: 'success', posts })
}
const getPostById = async (req, res, next) => {
    const foundedPost = await postModel.findById(req.params.id).populate([{ path: 'creator', select: '_id username email role' }, { path: 'comments', select: '-__v ' }, { path: 'reviews', select: '-__v ' }]).select('-__v')
    res.status(200).json({ message: 'success', foundedPost })
}
const getUserPost = async (req, res, next) => {
    const userFromToken = req.user
    const { id } = req.params
    const userPosts = await postModel.find({ creator: id }).populate([{ path: 'creator', select: '_id username email role' }, { path: 'comments', select: '-__v ' }, { path: 'reviews', select: '-__v ' }]).select('-__v')
    res.status(200).json({ message: 'success', userPosts })
}

const addPost = async (req, res, next) => {
    const { content } = req.body
    const userFromToken = req.user
    const addedPost = await postModel.create({ content, creator: userFromToken._id })
    res.status(201).json({ message: 'success', addedPost })
}

const updatePost = async (req, res, next) => {
    const { content } = req.body
    const { id } = req.params
    const userFromToken = req.user
    const foundedPost = await postModel.findById(id)
    if (!foundedPost) return next(new AppError('post not found', 404))
    if (foundedPost.creator.toString() !== userFromToken._id.toString()) return next(new AppError('unauthorized', 403))
    const updatedPost = await postModel.findByIdAndUpdate(id, { content }, { new: true })
    res.status(201).json({ message: 'success', updatedPost })

}

const deletPost = async (req, res, next) => {
    const { id } = req.params
    const userFromToken = req.user
    const foundedPost = await postModel.findById(id)
    if (!foundedPost) return next(new AppError('post not found', 404))
    if (foundedPost.creator.toString() !== userFromToken._id.toString() && userFromToken.role !== 'admin') return next(new AppError('unauthorized', 403))
    if (foundedPost) {
        const foundedPostComments = await commentModel.find({ post: foundedPost._id })
        const foundedPostReviews = await reviewModel.find({ post: foundedPost._id })
        /* delet post with it's Comments */
        if (foundedPostComments.length > 0) {
            foundedPostComments.forEach(async (comment) => {
                await commentModel.findByIdAndDelete(comment._id)
            })
        }
        /* delet post with it's reviews */
        if (foundedPostReviews.length !== 0) {
            foundedPostReviews.forEach(async (review) => {
                await reviewModel.findByIdAndDelete(review._id)
            })
        }
        const deletedPost = await postModel.findByIdAndDelete(id)
        res.status(201).json({ message: 'success', deletedPost })
    }

}

             /* Bounsssssssss */
const topRatedPost = async (req, res, next) => {
    // Aggregate pipeline to get the top 5 rated posts
    const pipeline = [
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'post',
                as: 'reviewArr'
            }
        },
        {
            $addFields: {
                averageRating: { $avg: '$reviewArr.rating' }
            }
        },
        {
            $sort: { averageRating: -1 }
        },
        {
            $limit: 5
        }
    ];

    const topPosts = await postModel.aggregate(pipeline)
    if (!topPosts) return next(new AppError('Error retrieving top rated posts:', 404))
    res.status(200).json({ message: 'Top 5 rated posts:', topPosts })

}
module.exports = { getAllPost, addPost, getUserPost, updatePost, deletPost, getPostById, topRatedPost }