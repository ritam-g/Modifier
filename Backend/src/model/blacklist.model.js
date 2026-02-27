const mongoose=require('mongoose')

const blackListTokenSchema=new mongoose.Schema({
    token:{
        Type:String,
        required:[true,'token is requried'],
    }
})

module.exports=mongoose.model('blackListToken',blackListTokenSchema)
