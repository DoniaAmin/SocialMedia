const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, signUp, logIn, updateUser, deleteUser } = require('./user.controller');
const { signupValidation, loginValidation } = require('../../../utils/authenticationSchema');
const verifyToken = require('../../../utils/verifyToken');
const fileUpload = require('../../../utils/fileUploader');

router.get('/', verifyToken, getAllUsers)

router.get('/:id', verifyToken, getUserById)

router.post('/signup', fileUpload(), signUp)

router.post('/login', loginValidation, logIn)

router.patch('/:id', verifyToken, updateUser)

router.delete('/:id', verifyToken, deleteUser)

module.exports = router;