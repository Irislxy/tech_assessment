const mongoose = require("mongoose")

const userCsvSchema = new mongoose.Schema({
  postid: String,
  id: String,
  name: String,
  email: String,
  body: String
})

module.exports = mongoose.model("UserCSV", userCsvSchema, "user_csv") //(model, schema, collection name)
