
<List key={author.id} component="ul">
          <ListItem
            button
            // selected={city.id === cityId}
            // onClick={() => {
            //   setCityID(city.id);
            //   handleAddTopic(false);
            //   handleEditTopic(false);
            // }}
          >
            <ListItemText primary={author.name} />
            {/* <ListItemSecondaryAction>
                <IconButton
                  className={classes.button}
                  aria-label="edit"
                  onClick={() => {
                    setCityID(city.id);
                    handleAddTopic(false);
                    handleEditTopic(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  className={classes.button}
                  aria-label="delete"
                  onClick={() => {
                    handleAddTopic(false);
                    handleEditTopic(false);
                    handleDeleteTopic(city.id, city.imagePublicId);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction> */}
          </ListItem>
        </List>



const addCityReview = gql`
  mutation addCityReview(
    $name: String!
    $country: String!
    $description: String!
    $authorId: ID!
    $photo: Upload
    $interestId: ID!
  ) {
    addCityReview(
      name: $name
      country: $country
      description: $description
      authorId: $authorId
      photo: $photo
      interestId: $interestId
    ) {
      id
      name
      country
      description
      authorId
      interestId
      imageUrl
    }
  }
`;






// it works
export default withStyles(styles)(
  compose(
    graphql(getCityDetail, {
      options: props => ({
        variables: {
          id: props.cityId
        }
      })
    }),
    graphql(getAuthorNames, { name: "getAuthorNamesQuery" }),
    graphql(addCityReview, { name: "addCityReviewMutation" }),
    graphql(getInterestNames, { name: "getInterestNamesQuery" })
  )(AddCityReview)
);

return (
  <Fragment>
    {this.state.id ? (
      <CityReviewDetail cityId={this.state.id} />
    ) : (
      <Fragment>
        <Typography variant="h4">Add Review Topic</Typography>
        <form id="addCity" onSubmit={this.handSubmit}>
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="interestId">Interest</InputLabel>
            <Select
              native
              value={this.state.interestId}
              onChange={this.handleSelectChange}
              name="interestId"
              inputProps={{
                id: "interestId"
              }}
            >
              <option value="" />
              {/* Execute to pull data to drop down box */}
              {this.displayInterests()}
            </Select>
          </FormControl>
          <br />
          {/* Pass handle function as prop 'this.handleTextChange' instead of */}
          {/* executing it as 'this.handleTextChange()' */}
          <TextField
            id="name"
            label="Title"
            value={this.state.name}
            required
            className={classes.formControl}
            onChange={this.handleTextChange}
          />
          <br />
          <TextField
            id="country"
            label="Country"
            value={this.state.country}
            required
            className={classes.formControl}
            onChange={this.handleTextChange}
          />
          <br />
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="authorId">Written by</InputLabel>
            <Select
              native
              value={this.state.authorId}
              onChange={this.handleSelectChange}
              name="authorId"
              inputProps={{
                id: "authorId"
              }}
            >
              <option value="" />
              {/* Execute to pull data to drop down box */}
              {this.displayAuthors()}
            </Select>
          </FormControl>
          <br />
          <TextField
            id="description"
            label="Description"
            multiline
            required
            rows="4"
            value={this.state.description}
            onChange={this.handleTextChange}
            className={classes.formControl}
          />
          <br />
          <br />
          <div>
            <Upload
              accept="image/png, image/jpeg"
              onChange={this.handleUpload}
              customRequest={dummyRequest}
            >
              <Button>
                <Icon type="upload" /> Upload image
              </Button>
            </Upload>
          </div>
          <br />
          <Button
            type="primary"
            disabled={!this.isSaveBtnEnabled()}
            onClick={this.handSubmit}
          >
            Save
          </Button>
          <Button type="danger" onClick={this.handleCancel}>
            Cancel
          </Button>
        </form>
      </Fragment>
    )}
  </Fragment>
);



import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { Upload, Icon, message, Button } from "antd";
import { Redirect } from "react-router-dom";
// Query
import { addCityReview, getCitiesList } from "../queries/city";
import { getAuthorNames } from "../queries/author";
// Material UI
import { withStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

// Ant design
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const styles = {
  root: {
    flex: 1
  },
  text: {
    color: "red"
  }
};

class AddCityReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      country: "",
      description: "",
      authorId: "",
      photo: null,
      redirect: false
    };
  }

  // Pull authors from database and fill in dropdown box
  displayAuthors = () => {
    let data = this.props.getAuthorNamesQuery;
    if (data.loading) {
      return <option disabled>Loading...</option>;
    } else {
      return data.authorList.map(author => (
        <option key={author.id} value={author.id}>
          {author.name}
        </option>
      ));
    }
  };

  // Ant Design
  handleUpload = info => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      // Save uploaded photo to component's state
      this.setState({ photo: info.file.originFileObj });
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Handle value change
  handleValueChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // Handle submit form
  handSubmit = async e => {
    e.preventDefault();
    this.props.addCityReviewMutation({
      variables: {
        name: this.state.name,
        country: this.state.country,
        description: this.state.description,
        authorId: this.state.authorId,
        photo: this.state.photo
      },
      refetchQueries: [{ query: getCitiesList }]
    });
    this.setState({ redirect: true });
  };

  rednerRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.rednerRedirect()}
        <Typography variant="h4">Add new city review</Typography>
        <form id="addCity" onSubmit={this.handSubmit}>
          <div>
            <label className={classes.text}>City name: </label>
            {/* Pass handle function as prop 'this.handleValueChange' instead of */}
            {/* executing it as 'this.handleValueChange()' */}
            <input
              type="text"
              id="name"
              defaultValue={this.state.name}
              onChange={this.handleValueChange}
              required
            />{" "}
            (*)
          </div>
          <br />
          <div>
            <label>Country: </label>
            <input
              type="text"
              id="country"
              defaultValue={this.state.country}
              onChange={this.handleValueChange}
              required
            />{" "}
            (*)
          </div>
          <br />
          <div>
            <label>Written by: </label>
            <select id="authorId" onChange={this.handleValueChange} required>
              <option>Select author</option>
              {/* Execute to pull data to drop down box */}
              {this.displayAuthors()}
            </select>{" "}
            (*)
          </div>
          <br />
          <div>
            <label>Description: </label>
            <textarea
              id="description"
              defaultValue={this.state.description}
              onChange={this.handleValueChange}
              required
            />{" "}
            (*)
          </div>
          <br />
          <div>
            <Upload
              accept="image/png, image/jpeg"
              onChange={this.handleUpload}
              customRequest={dummyRequest}
            >
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
          </div>
          <button>Save</button>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(
  compose(
    graphql(getAuthorNames, { name: "getAuthorNamesQuery" }),
    graphql(addCityReview, { name: "addCityReviewMutation" })
  )(AddCityReview)
);



// import React, { useContext } from "react";
// import { NavLink } from "react-router-dom";
// import AuthContext from "../contexts/auth-context";

// const NavigationBar = () => {
//   const authContext = useContext(AuthContext);

//   return (
//     <div>
//       <NavLink to="/">Home </NavLink>
//       {authContext.token && (
//         <NavLink to="/AddCityReview"> | Add Review</NavLink>
//       )}
//       {authContext.token && <NavLink to="/AddAuthor"> | Add Author</NavLink>}
//       {!authContext.token && <NavLink to="/Login"> | Login</NavLink>}
//       {authContext.token && <NavLink to="/Logout"> | Logout</NavLink>}
//     </div>
//   );
// };

// export default NavigationBar;

// class CityReviewList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       cityId: null
//     };
//   }

//   displayCityReviewList = () => {
//     // GraphQL server will return graphQL data saved to 'this.props'
//     let data = this.props.data;

//     // If 'loading' is still true, print out an message text
//     if (data.loading) {
//       return <h3>Still loading data...</h3>;
//     } else {
//       // Keep rendering graphQL data after loading is completed
//       return data.cityReviewList.map(city => {
//         return (
//           <li
//             key={city.id}
//             onClick={() => {
//               this.setState({ cityId: city.id });
//             }}
//           >
//             {city.name} ({city.country}) Written by: {city.author.name}
//           </li>
//         );
//       });
//     }
//   };

//   render() {
//     return (
//       <div>
//         <h3>City Review List</h3>
//         <ul>{this.displayCityReviewList()}</ul>
//         <hr />
//         <CityReviewDetail cityId={this.state.cityId} />
//       </div>
//     );
//   }
// }

// export default graphql(getCitiesList)(CityReviewList);


// const useStyles = makeStyles(theme => ({
//   button: {
//     margin: theme.spacing(1)
//   },
//   hidden: {
//     display: "none"
//   },
//   errMessage: {
//     diplay: "inline-block",
//     color: "red"
//   }
// }));

// function Login(props) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [errMsg, setErrMsg] = useState(null);

//   // use Context
//   const authContext = useContext(AuthContext);

//   const classes = useStyles();

//   const handleFormSubmit = e => {
//     e.preventDefault();
//     props
//       .UserVerification({
//         variables: {
//           email: email,
//           password: password
//         }
//       })
//       .then(data => {
//         // fill respond's data to Auth Contect's object
//         authContext.login({
//           userId: data.data.verifyUserLogin.userId,
//           token: data.data.verifyUserLogin.token,
//           tokenExp: data.data.verifyUserLogin.tokenExp,
//           profile: data.data.verifyUserLogin.profile
//         });

//         setErrMsg(null);
//         setLoggedIn(true);
//       })
//       .catch(err => {
//         if (err.message.includes("User")) {
//           setErrMsg("User does not exist!");
//         } else if (err.message.includes("password")) {
//           setErrMsg("Incorrect password!");
//         } else {
//           setErrMsg(err.message);
//         }
//       });
//   };

//   const handleTextFieldChange = e => {
//     switch (e.target.id) {
//       case "email":
//         setEmail(e.target.value);
//         break;
//       case "password":
//         setPassword(e.target.value);
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <div>
//       {loggedIn && <Redirect to="/" />}
//       <h1>Login System</h1>
//       {errMsg && (
//         <div id="errMsg" className={classes.errMessage}>
//           {errMsg}
//         </div>
//       )}
//       <form onSubmit={handleFormSubmit} method="post">
//         <div>
//           <TextField
//             required
//             id="email"
//             label="Email"
//             defaultValue=""
//             margin="normal"
//             onChange={handleTextFieldChange}
//           />
//         </div>
//         <div>
//           <TextField
//             required
//             id="password"
//             label="Password"
//             type="password"
//             autoComplete="current-password"
//             margin="normal"
//             onChange={handleTextFieldChange}
//           />
//         </div>
//         <div>
//           <Button
//             variant="contained"
//             color="primary"
//             className={classes.button}
//             onClick={handleFormSubmit}
//             disabled={email !== "" && password !== "" ? false : true}
//           >
//             Login
//           </Button>
//           <input type="submit" className={classes.hidden} />
//         </div>
//       </form>
//     </div>
//   );
// }

// export default graphql(verifyUserLogin, { name: "UserVerification" })(Login);
// //export default graghql(getUser)(Login); <-- ERROR: 'graghql' is not defined  no-undef (TYPO ERROR)


import React, { useState } from "react";
import { graphql } from "react-apollo";
import { verifyUserLogin } from "../queries/user";

const Login = data => {
  console.log(data);
  return (
    // <ul>
    //   {todos.map(({ id, text }) => (
    //     <li key={id}>{text}</li>
    //   ))}
    // </ul>
    <div>abc</div>
  );
};

export default graphql(verifyUserLogin, { name: "UserVerification" })(Login);



export default class Login extends Component {
  render() {
    const classes = useStyles();

    return (
      <div>
        <h2>Login System</h2>
        <form>
          <TextField
            required
            id="standard-required"
            label="Email"
            defaultValue=""
            margin="normal"
          />

          <TextField
            required
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
          />
          <p>
            <Button variant="outlined" size="small" color="primary">
              Small
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Primary
            </Button>
          </p>
        </form>
      </div>
    );
  }
}

// Ant design
// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

// Ant design
// function beforeUpload(file) {
//   const isJPG = file.type === "image/jpeg";
//   if (!isJPG) {
//     message.error("You can only upload JPG file!");
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error("Image must smaller than 2MB!");
//   }
//   return isJPG && isLt2M;
// }

// Ant design
//   handleUpload = info => {
//     if (info.file.status === "uploading") {
//       this.setState({ loading: true });
//       return;
//     }
//     if (info.file.status === "done") {
//       getBase64(info.file.originFileObj, photo =>
//         this.setState({
//           photo: photo,
//           loading: false
//         })
//       );
//     }
//   };

// const uploadButton = (
//   <div>
//     <Icon type={this.state.loading ? "loading" : "plus"} />
//     <div className="ant-upload-text">Upload JPG</div>
//   </div>
// );
// const displayedPhoto = this.state.photo ? (
//   <img src={this.state.photo} alt="picture" />
// ) : (
//   uploadButton
// );

/* <Upload
              name="photo"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={dummyRequest}
              beforeUpload={beforeUpload}
              onChange={this.handleUpload}
            >
              {displayedPhoto}
            </Upload> */

//================================================================
// Getting 'authorId' won't work, it throw error on UI
//================================================================
// const addCityReview = gql`mutation addCityReview($name: String!, $country: String!, $description: String!, $authorId: ID!) {
//     addCityReview(name: $name, country: $country, description: $description, authorId: $authorId) {
//         id
//         name
//         country
//         description
//         authorId
//     }
// }`
