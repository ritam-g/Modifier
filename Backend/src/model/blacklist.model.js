const mongoose=require('mongoose')
//NOTE - now we dont store token in db we have redis now which do fast work this 
const blackListTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,'token is requried'],
    }
})

module.exports=mongoose.model('blackListToken',blackListTokenSchema)
