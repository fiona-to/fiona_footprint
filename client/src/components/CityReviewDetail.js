import React, { Fragment } from "react";
import { graphql } from "react-apollo";
// Query
import { getCityDetail } from "../queries/city";
// Material Ui
import { Typography, makeStyles } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  description: {
    textAlign: "left",
    fontWeight: "fontWeightLight"
  }
}));

const CityReviewDetail = ({ data }) => {
  const classes = useStyle();

  const displayCityReviewDetail = () => {
    let { cityReview } = data;
    if (cityReview) {
      return (
        <Fragment>
          <Typography variant="h4">{cityReview.name}</Typography>
          <Typography variant="h6">{cityReview.country}</Typography>
          <p>Own by: {cityReview.author.name}</p>
          <p className={classes.description}>{cityReview.description}</p>
          <p>
            <img
              src={cityReview.imageUrl}
              alt="cloudinary"
              height="250"
              width="330"
            />
          </p>
        </Fragment>
      );
    } else {
      return <div>Click on a city on left pane for details....</div>;
    }
  };

  return <div>{displayCityReviewDetail()}</div>;
};

// Source from react-apollo: graphql() options for queries
// options.variables
export default graphql(getCityDetail, {
  options: props => ({
    variables: {
      id: props.cityId
    }
  })
})(CityReviewDetail);
