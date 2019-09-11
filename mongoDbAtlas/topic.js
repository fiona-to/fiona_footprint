const mongoose = require("mongoose");
const CityReview = require("../models/cityReview");

// Connect to mongoose db
mongoose.connect(
  "mongodb+srv://phuongto:Msjfeng82@cluster0-vwuwt.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("Connected to mongooseDb...");
});

CityReview.updateMany({}, { imagePublicId: "" }, (err, data) => {
  if (err) {
    throw new Error(err);
  } else {
    console.log(data);
  }
});

// Add a new field name "imagePublicId" to CityReview collection
// async function exeAddFields() {
//   await CityReview.aggregate([{ $addFields: { imagePublicId: "" } }]);
// }

//CityReview.aggregate([{ $addFields: { imagePublicId: "" } }]);

// Close connection
// mongoose.connection.close(err => {
//   if (err) {
//     throw new Error(err);
//   } else {
//     console.log("MongooseDB Atlas's connection was closed!");
//   }
// });
