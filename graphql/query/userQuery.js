const { gql } = require("apollo-server");

module.exports = gql`
    type RegisterType {
        id: ID!,
        token: String!,
        username: String!,
        email: String!,
        createdAt: String!
    }

    type Query {
        get: String!
    }

    type Mutation {
        register(username: String! email: String! password: String! confirmPassword: String!): RegisterType
    }
`;

