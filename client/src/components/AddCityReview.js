import React, { Component, Fragment } from "react";
import { graphql, compose, withApollo } from "react-apollo";
import { Upload, Icon, message, Button } from "antd";
// Component
import CityReviewDetail from "./CityReviewDetail";
// Query
import {
  addCityReview,
  getTopicBasedInterest,
  TOPIC_DETAIL_QUERY,
  TOPIC_UPDATE_MUTATION
} from "../queries/city";
import { getAuthorNames } from "../queries/author";
import { getInterestNames } from "../queries/interest";
// Material UI
import { withStyles } from "@material-ui/styles";
import {
  Typography,
  TextField,
  Select,
  FormControl,
  InputLabel
} from "@material-ui/core";

// Ant design
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const styles = {
  formControl: {
    width: 300,
    margin: "normal"
  },
  moreBottomSpace: {
    marginBottom: 50
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
      id: null,
      interestId: "",
      imageUrl: "",
      imagePublicId: ""
    };
  }

  loadDataInEditMode = async () => {
    const data = await this.props.client.query({
      query: TOPIC_DETAIL_QUERY,
      variables: { id: this.props.cityId }
    });
    // TODO: REFACTORY CODE HERE
    // .then(result => {
    //   this.setState({
    //     name: result.name,
    //     country: result.country,
    //     description: result.description,
    //     authorId: result.authorId,
    //     imageUrl: result.imageUrl,
    //     id: result.id,
    //     interestId: result.interestId
    //   });
    // })
    // .catch(err => {
    //   throw new Error(err);
    // });

    if (data.data.cityReview) {
      const result = data.data.cityReview;
      this.setState({
        name: result.name,
        country: result.country,
        description: result.description,
        authorId: result.authorId,
        imageUrl: result.imageUrl,
        id: result.id,
        interestId: result.interestId,
        imagePublicId: result.imagePublicId
      });
    }
  };

  componentDidMount() {
    if (this.props.cityId) {
      this.loadDataInEditMode();
    }
  }

  // each time user clicks on "Edit" btn randomly
  // then refetchData
  componentDidUpdate(prevProps) {
    if (this.props.cityId !== prevProps.cityId && this.props.isEdit) {
      this.loadDataInEditMode();
    }
  }

  // Display type of Interest (Places, Food, Drink)
  displayInterests = () => {
    let data = this.props.getInterestNamesQuery;
    if (data.loading) {
      return <option disabled>Loading...</option>;
    } else {
      return data.interestList.map(interest => (
        <option key={interest.id} value={interest.id}>
          {interest.name}
        </option>
      ));
    }
  };

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
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      // Save uploaded photo to component's state
      this.setState({ photo: info.file.originFileObj });
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Handle text value change
  handleTextChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSelectChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Handle submit form using 'async' and 'await'
  handSubmit = async e => {
    e.preventDefault();
    if (this.props.isAdd) {
      await this.props
        .addCityReviewMutation({
          variables: {
            name: this.state.name,
            country: this.state.country,
            description: this.state.description,
            authorId: this.state.authorId,
            photo: this.state.photo,
            interestId: this.state.interestId
          },
          refetchQueries: [
            {
              query: getTopicBasedInterest,
              variables: { interestId: this.state.interestId }
            }
          ]
        })
        .then(data => {
          this.setState({ id: data.data.addCityReview.id });
          this.props.handleAddTopic(false);
          this.props.handleEditTopic(false);
          this.props.handIdChange(this.state.id);
        })
        .catch(err => {
          throw new Error(err);
        });
    }
    if (this.props.isEdit && this.props.cityId) {
      await this.props.client
        .mutate({
          mutation: TOPIC_UPDATE_MUTATION,
          variables: {
            id: this.props.cityId,
            name: this.state.name,
            country: this.state.country,
            description: this.state.description,
            photo: this.state.photo,
            authorId: this.state.authorId,
            interestId: this.state.interestId,
            imageUrl: this.state.imageUrl,
            imagePublicId: this.state.imagePublicId
          },
          refetchQueries: [
            {
              query: getTopicBasedInterest,
              variables: { interestId: this.props.interestId }
            },
            {
              query: getTopicBasedInterest,
              variables: { interestId: this.state.interestId }
            }
          ]
        })
        .then(data => {
          this.props.handleAddTopic(false);
          this.props.handleEditTopic(false);
        })
        .catch(err => {
          throw new Error(err);
        });
    }
  };

  handleCancel = e => {
    this.props.handleEditTopic(false);
    this.props.handleAddTopic(false);
  };

  isSaveBtnEnabled = () => {
    return (
      this.state.name !== "" &&
      this.state.country !== "" &&
      this.state.authorId !== "" &&
      this.state.description !== "" &&
      this.state.interestId !== ""
    );
  };

  render() {
    const { classes } = this.props;
    const saveBtnText = this.props.isEdit ? "Update" : "Save";
    return (
      <Fragment>
        {this.state.id && !this.props.cityId && (
          <CityReviewDetail cityId={this.state.id} />
        )}
        {(this.props.isAdd || (this.props.isEdit && this.state.id)) && (
          <Fragment>
            <Typography variant="h4">
              {this.props.isAdd ? "Add New Topic" : "Edit Topic"}
            </Typography>
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
              <div>
                <img
                  src={this.state.imageUrl}
                  alt="cloudinary"
                  height="50"
                  width="80"
                />
              </div>
              <br />
              <Button
                className={classes.moreBottomSpace}
                type="primary"
                disabled={!this.isSaveBtnEnabled()}
                onClick={this.handSubmit}
              >
                {saveBtnText}
              </Button>
              <Button type="danger" onClick={this.handleCancel}>
                Cancel
              </Button>
            </form>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles)(
  compose(
    withApollo,
    graphql(getAuthorNames, { name: "getAuthorNamesQuery" }),
    graphql(addCityReview, { name: "addCityReviewMutation" }),
    graphql(getInterestNames, { name: "getInterestNamesQuery" })
  )(AddCityReview)
);

// export default withStyles(styles)(
//   compose(
//     graphql(getAuthorNames, { name: "getAuthorNamesQuery" }),
//     graphql(addCityReview, { name: "addCityReviewMutation" }),
//     graphql(getInterestNames, { name: "getInterestNamesQuery" }),
//     graphql(getCityDetail, {
//       options: props => ({ variables: { id: props.cityId } })
//     })
//   )(AddCityReview)
// );
// WHY CANNOT SET A NAME FOR QUERY 'getCityDetail'
// IF NOT NO RETURNING DATA????
// IT'S WEIRD
