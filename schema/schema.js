const fs = require("fs");
const path = require("path");
const graphql = require("graphql");
const { GraphQLUpload } = require("graphql-upload");
const shortid = require("shortid");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mongoose DB models
const CityReview = require("../models/cityReview");
const Author = require("../models/author");
//import Users from "../models/user"; <-- ERROR: Unexpected identifier at Module._compile
const User = require("../models/user");
const Interest = require("../models/interest");

// for bcrypt's usage
const SALT_WORK_FACTOR = 10;
const PROFILE_ADMIN = "admin";
const PROFILE_USER = "user";
const JWT_SECRET_KEY = "olibolotravelsite";

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} = graphql;

// Config cloudinary
cloudinary.config({
  cloud_name: "giato",
  api_key: "225697625248178",
  api_secret: "mNupKpwWWJUw68tdhj8bjQDKIj8"
});

// Store uploaded image from client (React) --> local system (folder)
const storeUpload = ({ stream, filename }) => {
  const id = shortid.generate();
  //const targetPath = path.join(__dirname, `../uploads/${id}-${filename}`);
  return __dirname;
  // return new Promise((resolve, reject) =>
  //   stream
  //     .on("error", error => reject(error))
  //     .pipe(fs.createWriteStream(targetPath))
  //     .on("error", error => reject(error))
  //     .on("finish", () => resolve({ targetPath }))
  // );
};

// Schema file has 3 responsibilities
//-------------------------------------------------
// Task 1:
// Define Type
//-------------------------------------------------
const CityReviewType = new GraphQLObjectType({
  name: "CityReview",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
    description: { type: GraphQLString },
    photo: { type: GraphQLUpload },
    imageUrl: { type: GraphQLString },
    authorId: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      }
    },
    interestId: { type: GraphQLString },
    imagePublicId: { type: GraphQLString }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    cityReview: {
      type: new GraphQLList(CityReviewType),
      resolve(parent, args) {
        return CityReview.find({ authorId: parent.id });
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    profile: { type: GraphQLString }
  })
});

const UserAuthType = new GraphQLObjectType({
  name: "UserAuthType",
  fields: () => ({
    userId: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenExp: { type: GraphQLInt },
    profile: { type: GraphQLString }
  })
});

const InterestType = new GraphQLObjectType({
  name: "InterestType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    cityReview: {
      type: new GraphQLList(CityReviewType),
      resolve(parent, args) {
        return CityReview.find({ interestId: parent.id });
      }
    }
  })
});

//-------------------------------------------------
// Task 2:
// Define relationships between types
//-------------------------------------------------

//-------------------------------------------------
// Task 3:
// How describe user to jump from front-end (React) into graph and get data
//-------------------------------------------------
//=======================================================================
// QUERY
//=======================================================================
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    cityReview: {
      type: CityReviewType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return CityReview.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db or other source
        return Author.findById(args.id);
      }
    },
    cityReviewList: {
      type: new GraphQLList(CityReviewType),
      resolve(parent, args) {
        return CityReview.find({});
      }
    },
    authorList: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    },
    getUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return User.findOne({ email: args.email });
      }
    },
    getUserList: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      }
    },
    interestList: {
      type: new GraphQLList(InterestType),
      resolve(parent, args) {
        return Interest.find({});
      }
    },
    getTopicBasedInterest: {
      type: new GraphQLList(CityReviewType),
      args: {
        interestId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return CityReview.find({ interestId: args.interestId });
      }
    }
  }
});

//=======================================================================
// MUTATION
//=======================================================================
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          description: args.description
        });
        return author.save();
        // IN ORDER TO CATCH ERROR, WANNA USE BELOW CODE
        // WHY IT WORKS DIFFERENTLY AS NOT RETURNING OBJ ???
        // await author
        //   .save()
        //   .then(result => {
        //     console.log(result);
        //     return result;
        //   })
        //   .catch(err => {
        //     throw new Error(err);
        //   });
      }
    },
    deleteAuthor: {
      type: AuthorType,
      args: {
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Author.deleteOne({ _id: args.authorId });
      }
    },
    addCityReview: {
      type: CityReviewType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        // GraphQLUpload is a type from middleware 'graphql-upload'
        photo: { type: GraphQLUpload },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
        interestId: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        let imageUrl = "",
          imagePublicId = "";
        let targetPath = "";

        // Proceed if photo exists
        if (args.photo) {
          const { filename, mimetype, createReadStream } = await args.photo;
          const stream = createReadStream();
          targetPath = await storeUpload({ stream, filename });
          //const { targetPath } = await storeUpload({ stream, filename });

          // try {
          //   const photo = await cloudinary.uploader.upload(targetPath, {
          //     use_filename: true,
          //     unique: false
          //   });
          //   imageUrl = cloudinary.url(`${photo.public_id}.${photo.format}`);
          //   imagePublicId = photo.public_id;
          //   // delete image after uploading to cloudinary
          //   fs.unlink(targetPath, err => {
          //     if (err) {
          //       throw new Error(err);
          //     }
          //     console.log("Uploaded image was deleted from Node server!");
          //   });
          // } catch (error) {
          //   throw new Error(error);
          // }
        }

        let cityReview = new CityReview({
          name: args.name,
          country: args.country,
          description: args.description,
          imageUrl: targetPath,
          authorId: args.authorId,
          interestId: args.interestId,
          imagePublicId: imagePublicId
        });
        return await cityReview.save();
      }
    },
    deleteCityReview: {
      type: CityReviewType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        imagePublicId: { type: GraphQLString }
      },
      async resolve(parent, args) {
        //delete image on Cloudinary if it exists
        if (args.imagePublicId !== "") {
          await cloudinary.uploader.destroy(
            args.imagePublicId,
            (err, result) => {
              if (err) {
                throw new Error(err);
              } else {
                console.log("Image was deleted: " + result);
              }
            }
          );
        }
        return CityReview.deleteOne({ _id: args.id });
      }
    },
    addUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        profile: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const user = await User.findOne({ email: args.email });
        if (user) throw new Error(`Email already exist!`);

        let newUser = new User();
        let hashedPassword = "";
        newUser.email = args.email;
        newUser.profile = args.profile;

        try {
          let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
          hashedPassword = await bcrypt.hash(args.password, salt);
        } catch (err) {
          throw new Error(err);
        }

        newUser.password = hashedPassword;
        await newUser.save(err => {
          if (err) {
            if (err.name === "MongoError" && err.code === 11000) {
              throw new Error("Email already exist!");
            }
          }
        });
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return User.deleteOne({ _id: args.id });
      }
    },
    verifyUserLogin: {
      type: UserAuthType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const user = await User.findOne({ email: args.email });
        if (!user) throw new Error(`User does not exist!`);

        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) throw new Error(`Incorrect password`);

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );

        return {
          userId: user.id,
          token: token,
          tokenExp: 1,
          profile: user.profile
        };
      }
    },
    addInterest: {
      type: InterestType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let interest = new Interest({
          name: args.name,
          description: args.description
        });

        return interest.save();
      }
    },
    updateCityReview: {
      type: CityReviewType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        // GraphQLUpload is a type from middleware 'graphql-upload'
        photo: { type: GraphQLUpload },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
        interestId: { type: new GraphQLNonNull(GraphQLID) },
        imageUrl: { type: GraphQLString },
        imagePublicId: { type: GraphQLString }
      },
      async resolve(parent, args) {
        let imageUrl = args.imageUrl;
        let imagePublicId = args.imagePublicId;

        // Proceed if photo exists
        if (args.photo) {
          const { filename, createReadStream } = await args.photo;
          const stream = createReadStream();
          const { targetPath } = await storeUpload({ stream, filename });
          try {
            const photo = await cloudinary.uploader.upload(targetPath, {
              use_filename: true,
              unique: false
            });

            // delete image from server side after uploading
            fs.unlink(targetPath, err => {
              if (err) {
                throw new Error(err);
              }
              console.log("Uploaded image was deleted from Node server!");
            });

            // delete old image from cloudinary server
            if (imagePublicId !== "") {
              await cloudinary.uploader.destroy(
                imagePublicId,
                (err, result) => {
                  if (err) {
                    throw new Error(err);
                  } else {
                    console.log(result);
                  }
                }
              );
            }
            imageUrl = photo.url;
            imagePublicId = photo.public_id;
          } catch (error) {
            throw new Error(error);
          }
        }

        return await CityReview.findOneAndUpdate(
          { _id: args.id },
          {
            name: args.name,
            country: args.country,
            description: args.description,
            imageUrl: imageUrl,
            authorId: args.authorId,
            interestId: args.interestId,
            imagePublicId: imagePublicId
          },
          // DeprecationWarning: Mongoose: `findOneAndUpdate()`
          // and `findOneAndDelete()` without the `useFindAndModify`
          // option set to false are deprecated
          { returnOriginal: false, useFindAndModify: false },
          (err, doc) => {
            if (err) {
              throw new Error(err);
            }
          }
        );
      }
    },
    updateAuthor: {
      type: AuthorType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return Author.findOneAndUpdate(
          { _id: args.id },
          { name: args.name, description: args.description },
          { returnOriginal: false, useFindAndModify: false },
          (err, doc) => {
            if (err) {
              throw new Error(err);
            }
          }
        );
      }
    }
  }
});

// Export GraphQLSchema to external file to use
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
