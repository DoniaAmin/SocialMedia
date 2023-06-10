require('dotenv').config()
const commentModel = require('../../../models/comment');
const postModel = require('../../../models/post');
const reviewModel = require('../../../models/review');
const userModel = require("../../../models/user");
const AppError = require('../../../utils/AppError');
const cloudinary = require('../../../utils/cloudinary')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    const { username, email, bio, password, role } = req.body;
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ProfileImages'
    });
    const addedUser = await userModel.create({ username, email, bio, password, role, profileImage: secure_url });
    addedUser.password = undefined;
    res.status(201).json({ message: 'success', addedUser });
}

const logIn = async (req, res, next) => {
    const { email, password } = req.body;
    const foundedUser = await userModel.findOne({ email }).select('+password');
    if (!foundedUser) return next(new AppError('Email or password is not correct', 404));
    const isMatch = await bcrypt.compare(password, foundedUser.password)
    if (!isMatch) return next(new AppError('Email or password is not correct', 404));
    const token = await jwt.sign({ id: foundedUser._id }, process.env.JWT_SECRET_KEY);
    foundedUser.password = undefined;
    res.status(201).json({ token, foundedUser });
}

const getAllUsers = async (req, res) => {
    const users = await userModel.find().populate({ path: 'posts', select: '_id content createdAt' }).select('-__v');

    res.status(200).json({ message: 'success', users });
}

const getUserById = async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id).populate({ path: 'posts', select: '_id content createdAt' }).select('-__v')
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ message: 'success', user });
}

const updateUser = async (req, res, next) => {
    const userFromToken = req.user;
    const { id } = req.params;
    if (userFromToken._id != id) return next(new AppError('unauthorized', 403))
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    res.status(201).json({ message: 'success', updatedUser });
}

const deleteUser = async (req, res, next) => {
    const userFromToken = req.user;
    const { id } = req.params;
    if (userFromToken._id != id && userFromToken.role != 'admin') return next(new AppError('unauthorized', 403))
    const deletedUser = await userModel.findByIdAndDelete(id);
    const foundedUserPosts = await postModel.find({ creator: id })
    const foundedUserComments = await commentModel.find({ user: id })
    const foundedUserreviews = await reviewModel.find({ user: id })
 
    /* delet userPost with postComments and postReviews*/
    if (foundedUserPosts.length !== 0) {
        foundedUserPosts.forEach(async (postEle) => {
            const foundedPostComments = await commentModel.find({ post: postEle._id })
            const foundedPostReviews = await reviewModel.find({ post: postEle._id })
            if (foundedPostComments.length > 0) {
               
                foundedPostComments.forEach(async (comment) => {
                    await commentModel.findByIdAndDelete(comment._id)
                   
                })
            }
            if (foundedPostReviews.length !== 0) {
                foundedPostReviews.forEach(async (review) => {
                    await reviewModel.findByIdAndDelete(review._id)
                })
            }
            await postModel.findByIdAndDelete(postEle._id)
        })
    }

    /* delet user comments at any posts*/
    if (foundedUserComments.length !== 0) {
        foundedUserComments.forEach(async(userComment)=>{
         await commentModel.findByIdAndDelete(userComment._id)
        })      
    }

    /* delet user review at any posts*/
    if (foundedUserreviews.length !== 0) {
        foundedUserreviews.forEach(async(userReview)=>{
         await reviewModel.findByIdAndDelete(userReview._id)
        })      
    }

    res.status(201).json({ message: 'success',deletedUser });
}

module.exports = { getAllUsers, getUserById, signUp, logIn, updateUser, deleteUser };