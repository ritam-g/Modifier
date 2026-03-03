const ImageKit = require('@imagekit/nodejs');

const client = new ImageKit({
    privateKey: process.env.PRIVATE_KEY, // This is the default and can be omitted
});

async function uplodeFile({ buffer, filename, folder = "" }) {
    const file = await client.files.upload({
        file: await ImageKit.toFile(Buffer.from(buffer), 'file'),
        fileName: filename,
        folder
    });
    return file
}

module.exports = { uplodeFile }