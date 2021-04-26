const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
// Middleware
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const { graphqlUploadExpress } = require("graphql-upload");
const isAuth = require("./middlewares/is-Auth");
// Schema
const schema = require("./schema/schema");

// Init
const app = express();

// Allow cross-origin requests
app.use(cors());
app.use(isAuth);

// [NEED TO CONFIG FOR DEPLOYMENT PURPOSE]
// Connect to mongoose db
// Set below 'options' to fix issues:
// 1. DeprecationWarning: Mongoose: `findOneAndUpdate() and `findOneAndDelete()` without the `useFindAndModify`
// option set to false are deprecated
// 2. (node:1632) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.connect(
  "mongodb+srv://phuongto:Msjfeng82@cluster0-vwuwt.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
);
mongoose.connection.once("open", () => {
  console.log("Connected to mongooseDb...");
});

// declare to use an endpoint '/graphql'
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

// [NEED TO CONFIG FOR DEPLOYMENT PURPOSE]
//app.use(express.static(path.join(__dirname, "client/build")));

// production mode
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "client/build")));
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  // });
  app.get("*", (req, res) => {
    res.sendfile(path.join((__dirname = "client/build/index.html")));
  });
}

// build mode
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/public/index.html"));
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is now listenning port ${port}`);
});
