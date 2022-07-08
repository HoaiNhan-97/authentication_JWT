const userSchema = require("./user.multi.module");
const {
  mongoTestDabase,
  // ,mongoUsersDabase
} = require("../../../config/connection_multi_mongodb.js");
module.exports = {
  _User: mongoTestDabase.model("user", userSchema),
  // userTest2: mongoUsersDabase.model("user",userSchema)
};
