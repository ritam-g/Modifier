const Redis = require("ioredis").default

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

redis.on("connect", () => {
    console.log('redis connected sucess fully');
})
redis.on("error", (err) => {
     console.log("❌ Redis Error:", err);
})
module.exports=redis