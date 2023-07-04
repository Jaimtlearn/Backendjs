const fs = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const { logEvents } = require('../utility/logger.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()



const userData = {
    user : require('../Model/user.json'),
    setUser : (newUser) => {
        this.user = newUser
    }
}


const WritetoDB = async (newJson)=>{
    // str = JSON.stringify(newJson)
    await fs.writeFile(path.join(__dirname,'..','Model','user.json'),JSON.stringify(newJson)).catch((err)=>{
        console.log(err.message)
    })
}

const loginUser =async (req,res)=>{
    const {email,username,password} = req.body
    if(!email || !username || !password){
        return res.status(409).json({error : "Wrong Credentials"})
    }
    const User = userData.user.filter((person)=>person.username == username)
    if (!User){
        return res.status(403).json({error:"User Not Found"})
    }
    var encryptPass
    try{
        encryptpass = User[0].password
    }
    catch(err){
        console.log("No password found")
    }
    // console.log(typeof(encryptpass))

    const PasswordMatching = await bcrypt.compare(password,encryptpass)
    
    if(!PasswordMatching){
        return res.status(403).json({error:"Incorrect Password"})
    }

    const AccessToken = jwt.sign({
        "username":username
    },process.env.ACCESS_KEY,{expiresIn : '60s'})
    
    const RefreshToken = jwt.sign({
        "username":username
    },process.env.REFRESH_KEY,{expiresIn : '1d'})
    // console.log(userData.user)
    const OtherUsers = userData.user.filter((person)=> person.username != username)
    // console.log(OtherUsers)
    const UserandToken = {...User[0], RefreshToken}
    const data = [...OtherUsers,UserandToken]
    userData.user = data
    await WritetoDB(userData.user)

    res.status(200).json({
        "AcessToken" : AccessToken,
        "RefreshToken" : RefreshToken
    })

}

const createNewAccessToken = (req,res)=> {
    var apiHeaders = req.headers['authorization']
    if (!apiHeaders) apiHeaders = req.headers['Authorization']
    if (!apiHeaders) return res.status(403).json({
        message : "Need a token"
    })
    apiHeaders = apiHeaders.split(' ')[1]
    console.log(apiHeaders)
    const User = userData.user.find((user)=> user.RefreshToken == apiHeaders)
    if (!User) return res.status(403).json({
        message : "Incorrect Token as User not found"
    })
    try{
        var result = jwt.verify(apiHeaders,process.env.REFRESH_KEY)
    }
    catch(err){
        return res.status(403).json({
            message : "Incorrect Token"
        })
    }
    const newAccessToken = jwt.sign({
        "username": User.username
    },process.env.ACCESS_KEY,{expiresIn : '60s'})
    return res.status(200).json({
        "New_Access_Token" : newAccessToken
    })
}

module.exports = {loginUser,createNewAccessToken}