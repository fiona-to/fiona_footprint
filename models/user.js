const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Users contain list of registered users
const UsersSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: String
});

module.exports = mongoose.model("Users", UsersSchema);
