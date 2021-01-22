const { gql } = require("apollo-server");

module.exports = gql`
  ## schema types
  type UserType {
    id: ID!
    token: String!
    username: String!
    email: String!
    createdAt: String!
  }

  ## user mutations
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): UserType
    login(username: String!, password: String!): UserType
  }
`;
