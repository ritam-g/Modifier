const id3=require('node-id3')
async function songController(req,res) {
    const tags=id3.read(req.file.buffer)
    console.log('tags',tags);
    
}

module.exports=songController