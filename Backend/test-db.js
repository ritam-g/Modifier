const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILURE:', err);
        process.exit(1);
    });

setTimeout(() => {
    console.error('⏳ TIMEOUT: Connection attempt took too long (> 10s)');
    process.exit(1);
}, 10000);
