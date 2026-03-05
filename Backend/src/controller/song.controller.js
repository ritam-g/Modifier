const id3 = require('node-id3')
const songModel = require('../model/song.model')
const { uplodeFile } = require('../services/storage.service')

function escapeRegex(value = '') {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getMoodVariants(mood = '') {
    const normalizedMood = mood.trim().toLowerCase()
    const aliasMap = {
        happy: ['happy'],
        sad: ['sad'],
        angry: ['angry'],
        neutral: ['neutral'],
        surprised: ['surprised', 'surprized'],
        surprized: ['surprized', 'surprised'],
    }

    return aliasMap[normalizedMood] || [normalizedMood]
}

async function CreateSongController(req, res) {
    try {
        const songBuffer = req.file.buffer
        const tags = id3.read(songBuffer)
        const { mood } = req.body
        const [file, posterFile] = await Promise.all([
            uplodeFile(
                {
                    buffer: songBuffer,
                    filename: tags.title + '.mp3',
                    folder: '/cohort-2/moddifier/song'
                }),
            uplodeFile(
                {
                    buffer: tags.image.imageBuffer,
                    filename: tags.title + '.jpg',
                    folder: '/cohort-2/moddifier/poster'
                })
        ])

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
async function createMultipleSong(req, res) {
    try {

        const files = req.files
        const { mood } = req.body

        const createdSongs = []
        //NOTE - all file details in the files
        for (const fileItem of files) {
            //REVIEW - songbuufer for the imgekit 
            const songBuffer = fileItem.buffer
            const tags = id3.read(songBuffer)
            //NOTE - optimize way of uploding file and poster at the same time using promise.all
            const [file, posterFile] = await Promise.all([
                uplodeFile({
                    buffer: songBuffer,
                    filename: tags.title + '.mp3',
                    folder: '/cohort-2/moddifier/song'
                }),
                uplodeFile({
                    buffer: tags.image.imageBuffer,
                    filename: tags.title + '.jpg',
                    folder: '/cohort-2/moddifier/poster'
                })
            ])
            //REVIEW - individual song creation in loop can be optimized by bulk insert after the loop but for that we need to have all the file and poster url before creating any song document, so we can not do that without making code complex and hard to read, so we will go with this approach for now and can optimize it later if needed
            const song = await songModel.create({
                url: file.url,
                posterUrl: posterFile.url,
                title: tags.title,
                mood
            })
            //NOTE - its for the user purpost one by one isnter and end of the day show
            createdSongs.push(song)
        }

        res.status(201).json({
            message: "songs created successfully",
            total: createdSongs.length,
            songs: createdSongs
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}
async function getSongController(req, res) {
    try {
        const mood = String(req.query.mood || '').trim()
        if (!mood) {
            return res.status(400).json({ message: 'mood query is required' })
        }

        const moodVariants = getMoodVariants(mood)
        const moodRegexes = moodVariants.map((variant) => new RegExp(`^${escapeRegex(variant)}$`, 'i'))
        const songs = await songModel.find({
            mood: { $in: moodRegexes }
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            message: 'songs fetched successfully',
            total: songs.length,
            songs
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}
module.exports = { CreateSongController, createMultipleSong, getSongController }
