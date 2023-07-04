const express = require('express')
const {logEvents} = require('../utility/logger.js')
const userRoute = express.Router()
const userController = require('../Contoller/userController.js')
const registerUser = require('../Contoller/signupController.js')
const registerUserRoute = express.Router()
const loginRoute = express.Router()
const loginController = require('../Contoller/loginController.js')
const apiRoute = express.Router()
const apiController = require('../Contoller/apiController.js')
const jwt = require('jsonwebtoken')

require('dotenv').config()

userRoute.use((req,res,next)=>{
    logEvents("Route : userRoute "+"Request type : " + req.method + " URL : " + req.originalUrl,__filename)
    next()
})

userRoute.get('/',(req,res)=>{
    res.send("At User Home Page")
})
userRoute.get('/allUsers', userController.getAllUsers)
userRoute.get('/oneUser', userController.getUser)
userRoute.patch('/updateUser', userController.updateUser)
userRoute.post('/createUser', userController.createNewUser)
userRoute.delete('/deleteUser', userController.DeleteUser)

registerUserRoute.use((req,res,next)=>{
    logEvents("Route : Register User "+"Request type : " + req.method + " URL : " + req.originalUrl,__filename)
    next()
})
registerUserRoute.get('/',(req,res)=>{
    res.status(202).send("At registered user Home")
})
registerUserRoute.post('/user',registerUser.registerUser)

loginRoute.use((req,res,next)=>{
    logEvents("Route : Register User "+"Request type : " + req.method + " URL : " + req.originalUrl,__filename)
    next()
})

loginRoute.get('/',(req,res)=>{
    res.status(202).send("At login Route Home")
})
loginRoute.post('/user',loginController.loginUser)
loginRoute.post('/internalToken', loginController.createNewAccessToken)

apiRoute.use((req,res,next)=>{
    var headerData
    // try{
        headerData = req.header('authorization')
        if(!headerData){
            headerData = req.header('Authorization')
        }
        console.log(headerData)
        const token = headerData.split(' ')[1]
        try{
            const result = jwt.verify(token,process.env.ACCESS_KEY)
            console.log(result)
            next()
        }
        catch(err){
            res.status(403).json(err.message)
        }
    // }
    // catch(err){
        // console.log("No Header is provided")
    // }
    
})
apiRoute.get('/',(req,res)=>{
    res.status(202).send("At Api Route Home")
})
apiRoute.post('/getData',apiController.getData)

module.exports = {userRoute,registerUserRoute,loginRoute,apiRoute}