const multer=require('multer')
//NOTE - define for memory storese 
const storage = multer.memoryStorage()
//NOTE - follwing the doc only 
const upload = multer(
    {
        storage: storage,

        limits: {
            fileSize: 10 * 1024 * 1024

        }
    }
)

module.exports=upload
