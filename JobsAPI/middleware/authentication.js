const {UnauthenticatedError} = require('../errors/index')
const{StatusCodes} = require('http-status-codes')
const userModel= require('../models/User')
const jwt = require('jsonwebtoken')
const authenticationMiddleware = async(req,res,next)=>{
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('No Token Provided')
    }
    const token = authHeader.split(' ')[1]
    try {
        const verifiedToken = jwt.verify(token,process.env.JWT_SECRET)
        const{userId ,name} =verifiedToken;
        // You can get user from database and attache it to request as well
        // const userObj= await userModel.findById({_id:userId}).select('-password')
        // console.log("🚀 ~ file: authentication.js ~ line 16 ~ authenticationMiddleware ~ userObj", userObj)
        // or you can just pass the name and id as we already have in verified token
        req.user={userId,name}
    } catch (error) {
        throw new UnauthenticatedError(error)
    }
    next()
}

module.exports=authenticationMiddleware