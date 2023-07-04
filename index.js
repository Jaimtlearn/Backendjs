const {logEvents} = require('./utility/logger.js')
const http = require('http')
const express = require('express')
const {userRoute,registerUserRoute,loginRoute, apiRoute} = require('./routes/userRoute.js')

const app = express()
app.use(express.json())

// console.log(__filename)
// logEvents("Creating a log",__filename)
// logEvents("Log Event 2",__filename,"ERROR")

// const server = http.createServer((req,res)=>{
//     res.write("Hello World")
//     res.end()
// })
// // Regex
// // ab?cd -> abcd, acd will work e(ab)?cd -> eabcd, ecd will work
// // ab+cd -> abcd, abbcd, abbbbcd, etc

app.use('/user',userRoute)
app.use('/registered',registerUserRoute)
app.use('/login',loginRoute)
app.use('/api',apiRoute)
// app.use('/register',registerRoute)

var myPrintMiddleware = (req,res,next)=>{
    logEvents("Request type : " + req.method + " URL : " + req.originalUrl,__filename)
    next()
}

app.use(myPrintMiddleware)

// app.use('/user',userRoute)

// app.get('/address/:houseNo./:blockNo',(req,res)=>{
//     console.log(req.params)
// })

// app.get('/address/:houseNo./:blockNo',(req,res)=>{
//     console.log(req.params)
// })


// app.get('/hello',(req,res)=>{
//     res.send("Inside Hello")
// })


// server.listen(3456, ()=>{
//     console.log("Listening to port : 3456")
// })


app.listen(3456,()=>{
    console.log("Listening at port : 3456")
})