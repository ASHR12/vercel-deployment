const express = require('express')
authRouter=express.Router()
const {registerUser,loginUser} = require('../controllers/auth')


authRouter.route('/register').post(registerUser)
authRouter.route('/login').post(loginUser)

module.exports=authRouter