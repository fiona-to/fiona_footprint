import React, { useState, Fragment, useContext, useEffect } from "react";
import { graphql, compose } from "react-apollo";
// Queries
import { deleteCityReview, getTopicBasedInterest } from "../queries/city";
// Components
import CityReviewDetail from "./CityReviewDetail";
import AddCityReview from "./AddCityReview";
import AuthContext from "../contexts/auth-context";
// Material Ui
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  List,
  ListItem,
  IconButton,
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
    padding: 20, //theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginTop: 5,
    marginBottom: 5,
    width: "100%",
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

const CityReviewList = props => {
  const [cityId, setCityID] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isInterestChanged, setIsInterestChanged] = useState(false);
  const classes = useStyles();
  const { token } = useContext(AuthContext);

  // If clicking to change interest item (place, food, drink)
  // it will mark interest is changed and always set first item
  // is selected
  useEffect(() => {
    setIsInterestChanged(true);
    setSelectedIndex(0);
  }, [props.interestId]);

  const handleAddTopic = value => {
    props.handleAddTopic(value);
  };

  const handleEditTopic = value => {
    props.handleEditTopic(value);
  };

  const handIdChange = id => {
    setCityID(id);
  };

  const handleDeleteTopic = (id, imagePublicId) => {
    props
      .deleteItemMutation({
        variables: {
          id: id,
          imagePublicId: imagePublicId
        },
        refetchQueries: [
          {
            query: getTopicBasedInterest,
            variables: { interestId: props.interestId }
          }
        ]
      })
      .then(data => {
        setCityID(null);
        props.handleAddTopic(false);
        props.handleEditTopic(false);
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  const displayCityReviewList = () => {
    // GraphQL server will also return graphQL data saved to 'props'
    // If 'loading' is still true, print out an message text
    if (props.getTopicBasedInterestQuery.loading) {
      return <h3>loading...</h3>;
    } else {
      const { getTopicBasedInterest } = props.getTopicBasedInterestQuery;
      if (getTopicBasedInterest.length === 0) {
        return <div>No items...</div>;
      }
      // Keep rendering graphQL data after loading is completed
      return getTopicBasedInterest.map((city, index) => {
        const displayedText = `${city.name} (${city.country})`;
        if (isInterestChanged && index === selectedIndex) {
          setCityID(city.id);
          setIsInterestChanged(false);
        }
        return (
          <List key={city.id} component="ul">
            <StyledListItem
              className={classes.listItem}
              button
              // selected={city.id === cityId}
              selected={index === selectedIndex}
              onClick={() => {
                setCityID(city.id);
                setSelectedIndex(index);
                handleAddTopic(false);
                handleEditTopic(false);
              }}
            >
              <ListItemText primary={displayedText} />
              {token && (
                <ListItemSecondaryAction>
                  <IconButton
                    className={classes.btnEdit}
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
                    className={classes.btnDelete}
                    aria-label="delete"
                    onClick={() => {
                      handleAddTopic(false);
                      handleEditTopic(false);
                      handleDeleteTopic(city.id, city.imagePublicId);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </StyledListItem>
          </List>
        );
      });
    }
  };

  return (
    <Fragment>
      <Grid container className={classes.root} spacing={0}>
        <Grid item xs={12} sm={6} md={6}>
          <Paper className={classes.paper}>{displayCityReviewList()}</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper className={classes.paper}>
            {!props.isAdd && !props.isEdit && (
              <CityReviewDetail cityId={cityId} />
            )}
            {props.isAdd && (
              <AddCityReview
                isAdd={props.isAdd}
                handIdChange={handIdChange}
                interestId={props.interestId}
                handleEditTopic={handleEditTopic}
                handleAddTopic={handleAddTopic}
              />
            )}
            {props.isEdit && (
              <AddCityReview
                isEdit={props.isEdit}
                cityId={cityId}
                interestId={props.interestId}
                handleEditTopic={handleEditTopic}
                handleAddTopic={handleAddTopic}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default compose(
  graphql(deleteCityReview, { name: "deleteItemMutation" }),
  graphql(
    getTopicBasedInterest,
    { name: "getTopicBasedInterestQuery" },
    {
      options: props => ({ variables: { interestId: props.interestId } })
    }
  )
)(CityReviewList);
