import React, { useState } from "react";
import { graphql } from "react-apollo";
// Queries
import { getInterestNames } from "../queries/interest";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const useStyles = makeStyles((theme) => ({
  footer: {
    flexGrow: 1,
    height: 56,
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#eeeeee",
  },
  foodDrink: {
    width: 24,
    height: 24,
  },
  interestText: {
    color: "#ff8080",
  },
}));

const Footer = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState("5d4b0ebf57981e0654f5bebf");

  const displayIcon = (value) => {
    let name = value.toLowerCase();
    switch (name) {
      case "place":
        return <LocationOnIcon />;
      case "food":
        return (
          <svg className={classes.foodDrink} viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M15.5,21L14,8H16.23L15.1,3.46L16.84,3L18.09,8H22L20.5,21H15.5M5,11H10A3,3 0 0,1 13,14H2A3,3 0 0,1 5,11M13,18A3,3 0 0,1 10,21H5A3,3 0 0,1 2,18H13M3,15H8L9.5,16.5L11,15H12A1,1 0 0,1 13,16A1,1 0 0,1 12,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15Z"
            />
          </svg>
        );
      case "drink":
        return (
          <svg className={classes.foodDrink} viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M18.32,8H5.67L5.23,4H18.77M12,19A3,3 0 0,1 9,16C9,14 12,10.6 12,10.6C12,10.6 15,14 15,16A3,3 0 0,1 12,19M3,2L5,20.23C5.13,21.23 5.97,22 7,22H17C18,22 18.87,21.23 19,20.23L21,2H3Z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const displayInterest = () => {
    if (props.data.loading) {
      return <div>loading...</div>;
    } else {
      let { interestList } = props.data;
      return interestList.map((interest) => (
        <BottomNavigationAction
          label={interest.name}
          key={interest.id}
          value={interest.id}
          icon={displayIcon(interest.name)}
        />
      ));
    }
  };

  const handleSelectChange = (e, newValue) => {
    setValue(newValue);
    props.handleInterestChange(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleSelectChange}
      className={classes.footer}
      showLabels
    >
      {displayInterest()}
    </BottomNavigation>
  );
};

export default graphql(getInterestNames)(Footer);
