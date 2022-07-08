const redis = require("redis");
const CONECT_OPTION = {
  url: "redis://192.168.150.128:6379",
};
const client = redis.createClient(CONECT_OPTION);

module.exports = client

