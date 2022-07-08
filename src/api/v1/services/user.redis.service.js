const client = require("../../../config/connection_redis.js");
async function set(userid, value, option = {}) {
    try {
      await client.connect();
      await client.set(userid, value, option);
      await client.quit();
    } catch (err) {
      throw new Error("Resdis " + err.message);
    }
  }
  async function get(key) {
    try {
  
      await client.connect();
      const value = await client.get(key);
      await client.quit();
      return value
    } catch (err) {
      throw new Error("Resdis " + err.message);
    }
  }
  async function del(key) {
    try {
      await client.connect();
      await client.del(key);
      await client.quit();
    } catch (err) {
      throw new Error("Resdis " + err.message);
    }
  }
  
  module.exports = { set, get, del };