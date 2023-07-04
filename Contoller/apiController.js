
const getData = (req,res)=>{
    res.status(200).json({
        message : "Some Data"
    })
}

module.exports = {getData}