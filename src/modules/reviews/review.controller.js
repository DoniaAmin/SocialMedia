const reviewModel = require('../../../models/review');
const AppError = require('../../../utils/AppError');

const getAllReview = async (req, res, next) => {
    const reviews = await reviewModel.find().populate({
        path: 'post',
        select: '_id content',
    }).populate({
        path: 'user',
        select: '_id username email role',
    }).select('-__v')
    res.status(200).json({ message: 'success', reviews })
}

const getPostReview = async (req, res, next) => {
    const postreviews = await reviewModel.find({ post: req.params.id }).populate({
        path: 'post',
        select: '_id content',
    }).populate({
        path: 'user',
        select: '_id username email role',
    }).select('-__v')
    res.status(200).json({ message: 'success', postreviews })
}
const getUserReview = async (req, res, next) => {
    if (req.user.role !== "admin") return next(new AppError('unauthorized', 403))
    const userReviews = await reviewModel.find({ user: req.params.id }).populate({
        path: 'post',
        select: '_id content',
    }).populate({
        path: 'user',
        select: '_id username email role',
    }).select('-__v')
    res.status(200).json({ message: 'success', userReviews})
}

const addReview = async (req, res, next) => {
    const { rating } = req.body
    const userFromToken = req.user
    const foundedReview = await reviewModel.findOne({ user: userFromToken._id, post: req.params.id })
    if (foundedReview) return next(new AppError("only one review is allowed ", 400))
    const addedreview = await reviewModel.create({ rating, user: userFromToken._id, post: req.params.id })
    res.status(201).json({ message: 'success', addedreview })
}

const updateReview = async (req, res, next) => {
    const { rating } = req.body
    const userFromToken = req.user
    const foundedreview = await reviewModel.findById(req.params.id)
    if (!foundedreview) return next(new AppError('review not found', 404))
    if (foundedreview.user.toString() !== userFromToken._id.toString()) return next(new AppError('unauthorized', 403))
    const updatedreview = await reviewModel.findByIdAndUpdate(req.params.id, { rating }, { new: true })
    res.status(201).json({ message: 'success', updatedreview })
}

const deletReview = async (req, res, next) => {
    const userFromToken = req.user
    const foundedreview = await reviewModel.findById(req.params.id).populate('user').populate('post')
    if (!foundedreview) return next(new AppError('commnt not found or already deleted', 404))
    const { creator } = foundedreview.post
    const { _id } = foundedreview.user
    if (_id.toString() !== userFromToken._id.toString() && userFromToken.role !== 'admin' && creator.toString() !== userFromToken._id.toString()) return next(new AppError('unauthorized', 403))
    const deletedreview = await reviewModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'success', deletedreview })
}

module.exports = { getUserReview, getAllReview, addReview, getPostReview, updateReview, deletReview }