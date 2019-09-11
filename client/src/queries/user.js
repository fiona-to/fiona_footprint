import gql from "graphql-tag";

const getUser = gql`
  query getUser($email: String!) {
    getUser(email: $email) {
      id
      email
      password
      profile
    }
  }
`;

const getUserList = gql`
  query getUserList {
    getUserList {
      id
      email
      password
      profile
    }
  }
`;

const verifyUserLogin = gql`
  mutation verifyUserLogin($email: String!, $password: String!) {
    verifyUserLogin(email: $email, password: $password) {
      userId
      token
      tokenExp
      profile
    }
  }
`;

const addUser = gql`
  mutation AddUser($email: String!, $password: String!) {
    addUser(email: $email, password: $password, profile: "user") {
      id
      email
      password
      profile
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export { getUser, getUserList, verifyUserLogin, addUser, DELETE_USER };
