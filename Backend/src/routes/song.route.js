const express = require('express');
const upload = require('../middleware/uplode.middleware');
const { CreateSongController, getSongController, createMultipleSong } = require('../controller/song.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const songRoute=express.Router()
/**
 * crete song 
 * this will make song 
 * 
 */

songRoute.post('/',upload.single('song'),CreateSongController)
/**
 * crete multiple song 
 * this will make song 
 * 
 */
songRoute.post('/multiple',upload.array('songs',20),createMultipleSong)
/**
 * get song 
 * this will return song 
 * 
 */
songRoute.get('/getsong',getSongController)
module.exports=songRoute