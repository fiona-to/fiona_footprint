import React, { useState, Fragment, useEffect } from "react";
import { graphql, compose, withApollo } from "react-apollo";
// Queries
import {
  addAuthor,
  getAuthorList,
  deleteAuthor,
  GET_AUTHOR_DETAIL,
  UPDATE_AUTHOR
} from "../queries/author";
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
import EditIcon from "@material-ui/icons/Edit";

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
  btnEdit: {
    margin: theme.spacing(1),
    color: "#ff8080"
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

function AddAuthor(props) {
  const [authorId, setAuthorId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const classes = useStyles();

  // As function ComponentDidMount() + ComponentDidUpdate()
  useEffect(() => {
    if (props.isAdd) {
      setIsHidden(false);
      setIsViewMode(false);
      setAuthorId("");
      setName("");
      setDescription("");
    }
  }, [props.isAdd]);

  const handleDeleteAuthor = id => {
    props
      .deleteAuthorMutation({
        variables: {
          authorId: id
        },
        refetchQueries: [{ query: getAuthorList }]
      })
      .then(data => {
        setIsViewMode(false);
        props.handleAddTopic(false);
        props.handleEditTopic(false);
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  const loadAuthorDetail = id => {
    props.client
      .query({
        query: GET_AUTHOR_DETAIL,
        variables: { id: id }
      })
      .then(data => {
        setAuthorId(id);
        setName(data.data.author.name);
        setDescription(data.data.author.description);
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  const loadViewMode = () => {
    setIsHidden(true);
    setIsViewMode(true);
    props.handleAddTopic(false);
    props.handleEditTopic(false);
  };

  const loadEditMode = () => {
    setIsHidden(false);
    setIsViewMode(false);
    props.handleAddTopic(false);
    props.handleEditTopic(true);
  };

  const displayAuthorList = () => {
    let data = props.getAuthorListQuery;
    if (data.loading) {
      return (
        <div>
          <h5>No added owner!</h5>
        </div>
      );
    } else {
      return data.authorList.map(author => (
        <List key={author.id} component="ul">
          <StyledListItem
            button
            selected={author.id === authorId}
            onClick={() => {
              loadAuthorDetail(author.id);
              loadViewMode();
            }}
          >
            <ListItemText primary={author.name} />
            <ListItemSecondaryAction>
              <IconButton
                className={classes.btnEdit}
                aria-label="edit"
                onClick={() => {
                  loadAuthorDetail(author.id);
                  loadEditMode();
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className={classes.btnDelete}
                aria-label="delete"
                disabled={author.cityReview.length > 0}
                onClick={() => {
                  handleDeleteAuthor(author.id);
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
    //this.setState({ [e.target.id]: e.target.value });
    switch (e.target.id) {
      case "name":
        setName(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleCancel = e => {
    setName("");
    setDescription("");
    setAuthorId("");
    setIsViewMode(false);
    props.handleEditTopic(false);
    props.handleAddTopic(false);
  };

  const isSaveBtnEnabled = () => {
    return name !== "" && description !== "";
  };

  // Handle submit form
  const handSubmit = e => {
    e.preventDefault();
    if (props.isAdd) {
      props
        .addAuthorMutation({
          variables: {
            name: name,
            description: description
          },
          refetchQueries: [{ query: getAuthorList }]
        })
        .then(data => {
          // TODO: DOUBLE CHECK BACK-END CODE
          // ABOUT RETURNING OBJ BY OTHER CODE
          // console.log(data);
          setName(data.data.addAuthor.name);
          setDescription(data.data.addAuthor.description);
          setAuthorId(data.data.addAuthor.id);
          loadViewMode();
        })
        .catch(err => {
          throw new Error(err);
        });
    } else if (props.isEdit) {
      props.client
        .mutate({
          mutation: UPDATE_AUTHOR,
          variables: {
            id: authorId,
            name: name,
            description: description
          },
          refetchQueries: [{ query: getAuthorList }]
        })
        .then(data => {
          loadViewMode();
        })
        .catch(err => {
          throw new Error(err);
        });
    }
  };

  const displayHeaderText = () => {
    let headerText = "";
    if (props.isEdit && authorId) {
      headerText = "Edit Owner's Bio";
    } else if (props.isAdd) {
      headerText = "Add Owner's Bio";
    } else if (isViewMode) {
      headerText = "Owner's Biography";
    } else {
      headerText = "Add or update Owner's Biography";
    }
    return headerText;
  };

  return (
    <Fragment>
      <Grid container className={classes.root} spacing={1}>
        <Grid item xs={12} sm={6} md={6}>
          <Paper className={classes.paper}>{displayAuthorList()}</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper className={classes.paper}>
            {!props.isEdit && !props.isAdd && !isViewMode && (
              <div>{displayHeaderText()}</div>
            )}
            {((props.isEdit && authorId) ||
              props.isAdd ||
              (isViewMode && authorId)) && (
              <Fragment>
                <Typography variant="h4">{displayHeaderText()}</Typography>
                <FormControl
                  required
                  className={classes.formControl}
                  onSubmit={handSubmit}
                >
                  <TextField
                    id="name"
                    label="Owner name"
                    value={name}
                    required
                    disabled={isViewMode}
                    className={classes.formControl}
                    onChange={handleTextChange}
                  />
                  <br />
                  <TextField
                    id="description"
                    label="Biography"
                    multiline
                    required
                    rows="4"
                    value={description}
                    disabled={isViewMode}
                    onChange={handleTextChange}
                    className={classes.formControl}
                  />
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    hidden={isHidden}
                    disabled={!isSaveBtnEnabled()}
                    onClick={handSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    hidden={isHidden}
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
  graphql(addAuthor, { name: "addAuthorMutation" }),
  graphql(getAuthorList, { name: "getAuthorListQuery" }),
  graphql(deleteAuthor, { name: "deleteAuthorMutation" })
)(AddAuthor);
