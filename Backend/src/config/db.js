const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb is connected sucessfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        throw err; // Crucial for server.js to catch
    }
}
module.exports = connectDB