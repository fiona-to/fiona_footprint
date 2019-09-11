import React, { useState, Fragment, useEffect } from "react";
import { graphql, compose, withApollo } from "react-apollo";
import _ from "lodash-checkit";
// Queries
import { addUser, getUserList, DELETE_USER } from "../queries/user";
// Material UI
import {
  Paper,
  Grid,
  List,
  ListItem,
  IconButton,
  makeStyles,
  Typography,
  TextField,
  FormControl,
  Button,
  withStyles
} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: 20,
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginTop: 5,
    marginBottom: 5,
    height: 500,
    overflowY: "auto"
  },
  btnDelete: {
    margin: theme.spacing(1),
    color: "#ffcbcb"
  },
  formControl: {
    width: 300,
    margin: "normal"
  }
}));

const StyledListItem = withStyles({
  root: {
    "&$selected": {
      backgroundColor: "#d1eecc"
    }
  },
  selected: {}
})(ListItem);

function AddUser(props) {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const classes = useStyles();

  useEffect(() => {
    if (props.isAdd) {
      setIsError(false);
      setEmailMsg("");
      setUserId("");
      setEmail("");
      setPassword("");
    }
  }, [props.isAdd]);

  const handleDeleteUser = id => {
    props.client
      .mutate({
        mutation: DELETE_USER,
        variables: {
          id: id
        },
        refetchQueries: [{ query: getUserList }]
      })
      .then(data => {
        return;
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  const displayUserList = () => {
    let data = props.getUserListQuery;
    if (data.loading) {
      return (
        <div>
          <h5>Loading...</h5>
        </div>
      );
    } else {
      return data.getUserList.map(user => (
        <List key={user.id} component="ul">
          <StyledListItem
            button
            selected={user.id === userId}
            onClick={() => {
              setUserId(user.id);
              props.handleAddTopic(false);
            }}
          >
            <ListItemText primary={`${user.email} (${user.profile})`} />
            <ListItemSecondaryAction>
              <IconButton
                className={classes.btnDelete}
                aria-label="delete"
                disabled={user.profile === "admin"}
                onClick={() => {
                  handleDeleteUser(user.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </StyledListItem>
        </List>
      ));
    }
  };

  // Handle value change
  const handleTextChange = e => {
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

  const handleCancel = e => {
    setEmail("");
    setPassword("");
    setUserId("");
    props.handleAddTopic(false);
  };

  const isSaveBtnEnabled = () => {
    return email !== "" && password !== "" && !isError;
  };

  const handleEmailLostFocus = e => {
    const inputEmail = e.target.value;
    if (inputEmail !== "" && !_.isEmail(inputEmail)) {
      setIsError(true);
      setEmailMsg("Invalid email address, please correct!");
    } else {
      setIsError(false);
      setEmailMsg("");
    }
  };

  // Handle submit form
  const handSubmit = e => {
    e.preventDefault();
    // TODO:
    // AS WE HAVE LIST OF USER'S EMAIL ADDRESS ALREADY RENDER
    // WE CAN VALIDATE EMAIL FROM FRONT END WHILE AFTER LOST FOCUS
    // INSTEAD OF LEAVING IT FOR SERVER'S VALIDATION
    if (props.isAdd && !isError) {
      props
        .addUserMutation({
          variables: {
            email: email,
            password: password
          },
          refetchQueries: [
            {
              query: getUserList,
              // Temporary Fix issue: user list didn't render new added user after submitting
              variables: { value: Math.floor(Math.random() * 101) },
              options: { fetchPolicy: "cache-and-network" }
            }
          ]
        })
        .then(data => {
          setEmail("");
          setPassword("");
          setUserId("");
          props.handleAddTopic(false);
        })
        .catch(err => {
          if (err.message.includes("Email")) {
            setIsError(true);
            setEmailMsg("Email already exist! Try again.");
          } else {
            console.log(err);
          }
        });
    }
  };

  return (
    <Fragment>
      <Grid container className={classes.root} spacing={1}>
        <Grid item xs={12} sm={6} md={6}>
          <Paper className={classes.paper}>{displayUserList()}</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper className={classes.paper}>
            {!props.isAdd && <div>Manage User Dashboard</div>}
            {props.isAdd && (
              <Fragment>
                <Typography variant="h4">Register a new user</Typography>
                <FormControl
                  required
                  className={classes.formControl}
                  onSubmit={handSubmit}
                >
                  <TextField
                    id="email"
                    label="Email"
                    value={email}
                    required
                    className={classes.formControl}
                    onChange={handleTextChange}
                    error={isError}
                    helperText={emailMsg}
                    onBlur={handleEmailLostFocus}
                  />
                  <br />
                  <TextField
                    id="password"
                    label="Password"
                    required
                    type="password"
                    value={password}
                    onChange={handleTextChange}
                    className={classes.formControl}
                  />
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={!isSaveBtnEnabled()}
                    onClick={handSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </FormControl>
              </Fragment>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default compose(
  withApollo,
  graphql(addUser, { name: "addUserMutation" }),
  graphql(getUserList, { name: "getUserListQuery" })
)(AddUser);
