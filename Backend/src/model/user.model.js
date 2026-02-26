const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username is alredy exiest"]
    },
    password:{
        type:String,
        required:[true,"username is required"],
        
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email is alredy exiest"]
    }
})
module.exports=mongoose.model("user",userSchema)