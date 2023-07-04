const {format} = require('date-fns')
const {v4 : uuidv4} = require('uuid4')
const fs = require('fs').promises //preinstalled
const path = require('path') // preinstalled
const uuid4 = require('uuid4')

const logEvents = async (message, filename, type="Info") => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const id = uuid4()
    const logData = `${dateTime}\t${id}\t${type}\t${message}\t${filename}\n`
    try {
        var isFileThere = await checkFileExists(path.join(__dirname,'log'))
        // console.log(isFileThere)
        if(!isFileThere){
            await fs.mkdir(path.join(__dirname,'log'))
            await fs.writeFile(path.join(__dirname,'log','dev_logs.txt'),"")
        }
        await fs.appendFile(path.join(__dirname,'log','dev_logs.txt'), logData)
        console.log("Logged Successfully")
    }
    catch(err){
        console.log(err)
    }
}

function checkFileExists(file){
    // console.log(file)
    return fs.access(file,fs.constants.F_OK)
                .then(()=> true)
                .catch(()=>false)
}

module.exports = {logEvents}