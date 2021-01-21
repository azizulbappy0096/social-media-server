const { gql } = require("apollo-server");

module.exports = gql`
    type CommentLikeType {
        username: String!
                createdAt: String!
    }

    type PostType {
        username: String!
        body: String!
        createdAt: String!
        comments: [CommentLikeType]
        likes: [CommentLikeType]
    }

    type Query {
        getPosts: [PostType]
    }

`;