const id3 = require('node-id3')
const songModel = require('../model/song.model')
const { uplodeFile } = require('../services/storage.service')
async function songController(req, res) {
    try {
        const songBuffer = req.file.buffer
        const tags = id3.read(songBuffer)
        const { mood } = req.body
        const file = await uplodeFile(
            {
                buffer: songBuffer,
                filename: tags.title + '.mp3',
                folder: '/cohort-2/moddifier/song'
            })

        const posterFile = await uplodeFile(
            {
                buffer: tags.image.imageBuffer,
                filename: tags.title + '.jpg',
                folder: '/cohort-2/moddifier/poster'
            })
        const song = await songModel.create({
            url: file.url,
            posterUrl: posterFile.url,
            title: tags.title,
            mood
        })
        res.status(201).json({
            message: 'song created successfully',
            song
        })
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: err.message })
    }
}

module.exports = songController