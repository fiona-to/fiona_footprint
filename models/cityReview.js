const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a table named 'CityReview' with defined schema 'cityReviewSchema'
const cityReviewSchema = new Schema({
  name: String,
  country: String,
  description: String,
  imageUrl: String,
  authorId: String,
  interestId: String,
  imagePublicId: String
});

module.exports = mongoose.model("CityReview", cityReviewSchema);
