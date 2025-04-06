const Redis = require("ioredis");

const redis = new Redis({
  host: "redis-12897.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 12897, // Provided by Redis Cloud
  password: "515dabFVnZEJoh1gxBDuKwFKRZKU846r",
});

module.exports = redis;