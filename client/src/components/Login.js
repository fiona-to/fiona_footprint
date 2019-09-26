import React, { useState, useContext } from "react";
import { graphql } from "react-apollo";
import { Redirect } from "react-router-dom";
// Material UI
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  makeStyles
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

// Custom Components
import AuthContext from "../contexts/auth-context";

// Queries
import { verifyUserLogin } from "../queries/user";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 430
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  hidden: {
    display: "none"
  },
  errMessage: {
    diplay: "inline-block",
    color: "red"
  }
}));

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  // use Context
  const { login } = useContext(AuthContext);
  const classes = useStyles();

  const handleFormSubmit = e => {
    e.preventDefault();
    props
      .UserVerification({
        variables: {
          email: email,
          password: password
        }
      })
      .then(data => {
        // fill respond's data to Auth Contect's object
        login({
          userId: data.data.verifyUserLogin.userId,
          token: data.data.verifyUserLogin.token,
          tokenExp: data.data.verifyUserLogin.tokenExp,
          profile: data.data.verifyUserLogin.profile
        });

        setErrMsg(null);
        props.handleLogIn(true);
      })
      .catch(err => {
        if (err.message.includes("User")) {
          setErrMsg("User does not exist!");
        } else if (err.message.includes("password")) {
          setErrMsg("Incorrect password!");
        } else {
          setErrMsg(err.message);
        }
      });
  };

  const handleTextFieldChange = e => {
    switch (e.target.id) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {props.isLogIn && <Redirect to="/" />}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {errMsg && (
          <div id="errMsg" className={classes.errMessage}>
            {errMsg}
          </div>
        )}
        <form
          onSubmit={handleFormSubmit}
          method="post"
          className={classes.form}
          noValidate
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleTextFieldChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleTextFieldChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleFormSubmit}
            disabled={email !== "" && password !== "" ? false : true}
          >
            Login
          </Button>
          <input type="submit" className={classes.hidden} />
        </form>
      </div>
    </Container>
  );
}
export default graphql(verifyUserLogin, { name: "UserVerification" })(Login);
// //export default graghql(getUser)(Login); <-- ERROR: 'graghql' is not defined  no-undef (TYPO ERROR)
