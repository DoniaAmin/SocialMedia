const commentModel = require('../../../models/comment');
const AppError = require('../../../utils/AppError');

const getAllComment = async (req, res, next) => {
    const comments = await commentModel.find().populate('post').populate('user')
    res.status(200).json({ message: 'success', comments })
}

const getPostComment = async (req, res, next) => {
    const { id } = req.params
    const postComments = await commentModel.find({ post: id })
    res.status(200).json({ message: 'success', postComments })
}

const getUserComment = async (req, res, next) => {
    if (req.user.role !== "admin") return next(new AppError('unauthorized', 403))
    const userComment = await commentModel.find({ user: req.params.id }).populate({
        path: 'post',
        select: '_id content',
    }).populate({
        path: 'user',
        select: '_id username email role',
    }).select('-__v')
    res.status(200).json({ message: 'success', userComment })
}


const addComment = async (req, res, next) => {
    const { content } = req.body
    const userFromToken = req.user
    const addedComment = await commentModel.create({ content, user: userFromToken._id, post: req.params.id })
    res.status(201).json({ message: 'success', addedComment })
}

const updateComment = async (req, res, next) => {
    const { content } = req.body
    const { id } = req.params
    const userFromToken = req.user
    const foundedComment = await commentModel.findById(id)
    if (!foundedComment) return next(new AppError('comment not found', 404))
    if (foundedComment.user.toString() !== userFromToken._id.toString()) return next(new AppError('unauthorized', 403))
    const updatedComment = await commentModel.findByIdAndUpdate(id, { content }, { new: true })
    res.status(201).json({ message: 'success', updatedComment })
}

const deletComment = async (req, res, next) => {
    const { id } = req.params
    const userFromToken = req.user
    const foundedComment = await commentModel.findById(id).populate('user').populate('post')
    if (!foundedComment) return next(new AppError('commnt not found or already deleted', 404))
    const { creator } = foundedComment.post
    const { _id } = foundedComment.user
    if (_id.toString() !== userFromToken._id.toString() && userFromToken.role !== 'admin' && creator.toString() !== userFromToken._id.toString()) return next(new AppError('unauthorized', 403))
    const deletedComment = await commentModel.findByIdAndDelete(id)
    res.status(201).json({ message: 'success', deletedComment })
}

module.exports = { getUserComment, getAllComment, addComment, getPostComment, updateComment, deletComment }