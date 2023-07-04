const fs = require('fs').promises
const path = require('path')
const { user } = require('./signupController')
const userData = {
    user : require('../Model/user.json'),
    setUser : (newData) => {
        this.user = newData
    }
}

const WritetoDB = async (newJson)=>{
    // str = JSON.stringify(newJson)
    await fs.writeFile(path.join(__dirname,'..','Model','user.json'),JSON.stringify(newJson)).catch((err)=>{
        console.log(err.message)
    })
}

const getAllUsers = (req,res) =>{
    res.status(200).json(userData.user)
}

const createNewUser =async (req,res)=>{

    if(!req.body || !req.body.firstname || !req.body.lastname){
        return res.status(403).json({message : "Wrong Request"})
    }

    const newUser = {
        id : userData.user.length ? userData.user.length +1 : 1,
        firstname : req.body.firstname,
        lastname : req.body.lastname 
    }
    userData.user.push(newUser)
    WritetoDB(userData.user)
    // console.log(userData.user)
    res.status(200).json(userData.user)
}



const updateUser = (req,res)=>{

    if(!req.body || !req.body.firstname || !req.body.lastname){
        return res.status(403).json({message : "Wrong Request"})
    }

    var User = userData.user.find((user)=> user.id == req.body.id)
    User.firstname = req.body.firstname
    User.lastname = req.body.lastname
    // console.log(User)
    var otherUsers = userData.user.filter((user)=>user.id != req.body.id)
    // console.log(otherUsers)
    userData.setUser([...otherUsers,User])
    WritetoDB(userData.user)
    res.status(201).json(userData.user)
}

const DeleteUser = (req,res)=>{
    if(!req.body.id){
        return res.status(403).json({message : "Wrong Request"})
    }
    var otherUsers = userData.user.filter((User)=>User.id != req.body.id)
    // console.log(otherUsers)
    userData.user = [otherUsers]
    WritetoDB([otherUsers])
    res.status(201).json(userData.user)
}

const getUser = (req,res)=>{
    if(!req.query.id){
        return res.status(403).json({message:"Wrong Request"})
    }
    const User = userData.user.find((user)=> user.id == req.query.id)
    res.status(202).json(User)
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    DeleteUser,
    createNewUser
}