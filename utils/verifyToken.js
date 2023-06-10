require('dotenv').config()
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const AppError = require('./AppError');

const verifyToken = async(req,res,next)=>{
    const token = req.headers.authorization;
    if(!token) return next(new AppError('please login first',404))
    const {id} = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(id);
    if(!user) return next(new AppError('invalid token',404));
    req.user = user;
    next();
}

module.exports = verifyToken;