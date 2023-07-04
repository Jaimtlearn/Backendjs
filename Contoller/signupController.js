const fs = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const { logEvents } = require('../utility/logger.js')
const All_Permissions = require('../Config/all_permissions.js')

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

const registerUser = async (req,res) => {
    const {email, username, password} = req.body
    if(!email || !username || !password){
        res.status(403).json({error:"Wrong Credentials"})
    }

    var Username = userData.user.find((user)=> user.username == username)
    if(Username){
        res.send(409).json({error:"User Already Exists"})
    }
    var encryptPass
    try{
        encryptPass = await bcrypt.hash(req.body.password,10)
    }
    catch(err){
        logEvents(err.message, __filename, "ERROR")
    }

    const newUser = {
        "username": username,
        "password": encryptPass,
        "email": email,
        "permissions" : [All_Permissions.READ]
    }
    // console.log(newUser)
    userData.user.push(newUser)
    WritetoDB(userData.user)
    res.status(202).json(userData.user)
}

module.exports = {
    registerUser
}