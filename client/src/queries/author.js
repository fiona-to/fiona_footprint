import gql from "graphql-tag";

const getAuthorNames = gql`
  query authorList {
    authorList {
      id
      name
    }
  }
`;

const addAuthor = gql`
  mutation addAuthor($name: String!, $description: String!) {
    addAuthor(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const getAuthorList = gql`
  query authorList {
    authorList {
      id
      name
      description
      cityReview {
        name
        country
      }
    }
  }
`;

const deleteAuthor = gql`
  mutation deleteAuthor($authorId: ID!) {
    deleteAuthor(authorId: $authorId) {
      id
      name
    }
  }
`;

const GET_AUTHOR_DETAIL = gql`
  query author($id: ID!) {
    author(id: $id) {
      id
      name
      description
    }
  }
`;

const UPDATE_AUTHOR = gql`
  mutation updateAuthor($id: ID!, $name: String!, $description: String!) {
    updateAuthor(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export {
  getAuthorNames,
  addAuthor,
  getAuthorList,
  deleteAuthor,
  GET_AUTHOR_DETAIL,
  UPDATE_AUTHOR
};
