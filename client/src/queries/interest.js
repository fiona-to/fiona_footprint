import gql from "graphql-tag";

const getInterestNames = gql`
  query interestList {
    interestList {
      id
      name
    }
  }
`;

export { getInterestNames };
