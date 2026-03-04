const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    posterUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        enum: {
            values: ['happy', 'surprized', 'angry', 'Neutral','sad']
        },
        default: 'nutral'
    },
},{ timestamps: true })

module.exports=mongoose.model('song',songSchema)