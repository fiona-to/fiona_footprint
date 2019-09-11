const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interest = new Schema({
  name: String,
  description: String
});

module.exports = mongoose.model("Interest", interest);
