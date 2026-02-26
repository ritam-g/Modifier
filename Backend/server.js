const app = require('./src/app');
const connectDB  = require('./src/config/db');

require('dotenv').config()
connectDB()
app.listen(process.env.PORT,()=>{
    console.log('server is running ');   
})