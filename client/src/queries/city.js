import gql from "graphql-tag";

const getCitiesList = gql`
  query getCityList {
    cityReviewList {
      id
      name
      country
      description
      author {
        id
        name
        description
      }
    }
  }
`;

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

const getCityDetail = gql`
  query($id: ID) {
    cityReview(id: $id) {
      id
      name
      country
      description
      imageUrl
      authorId
      author {
        id
        name
        description
      }
      interestId
    }
  }
`;

const deleteCityReview = gql`
  mutation DeleteCityReivew($id: ID!, $imagePublicId: String) {
    deleteCityReview(id: $id, imagePublicId: $imagePublicId) {
      id
      name
    }
  }
`;

const getTopicBasedInterest = gql`
  query getTopicBasedInterest($interestId: ID!) {
    getTopicBasedInterest(interestId: $interestId) {
      id
      name
      country
      description
      author {
        id
        name
        description
      }
      interestId
      imagePublicId
    }
  }
`;

const TOPIC_DETAIL_QUERY = gql`
  query($id: ID) {
    cityReview(id: $id) {
      id
      name
      country
      description
      imageUrl
      authorId
      author {
        id
        name
        description
      }
      interestId
      imagePublicId
    }
  }
`;

const TOPIC_UPDATE_MUTATION = gql`
  mutation updateCityReview(
    $id: ID!
    $name: String!
    $country: String!
    $description: String!
    $photo: Upload
    $authorId: ID!
    $interestId: ID!
    $imageUrl: String
    $imagePublicId: String
  ) {
    updateCityReview(
      id: $id
      name: $name
      country: $country
      description: $description
      photo: $photo
      authorId: $authorId
      interestId: $interestId
      imageUrl: $imageUrl
      imagePublicId: $imagePublicId
    ) {
      id
      name
      country
      description
      photo
      authorId
      interestId
      imageUrl
      imagePublicId
    }
  }
`;

export {
  getCitiesList,
  addCityReview,
  getCityDetail,
  deleteCityReview,
  getTopicBasedInterest,
  TOPIC_DETAIL_QUERY,
  TOPIC_UPDATE_MUTATION
};
