const express = require('express');
const upload = require('../middleware/uplode.middleware');
const songController = require('../controller/song.controller');

const songRoute=express.Router()
/**
 * crete song 
 * this will make song 
 * 
 */

songRoute.post('/',upload.single('song'),songController)

module.exports=songRoute