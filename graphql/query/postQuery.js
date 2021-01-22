const { gql } = require("apollo-server");

module.exports = gql`
  ## schema types
  type CommentType {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
  }

  type LikeType {
    id: ID!
    username: String!
    createdAt: String!
  }

  type PostType {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
    comments: [CommentType]
    likes: [LikeType]
  }

  ## post queries
  type Query {
    getPosts: [PostType]
    getPost(postId: ID!): PostType
  }

  ## post mutations
  extend type Mutation {
    addPost(body: String!): PostType
    deletePost(postId: ID!): String!
    addComment(postId: ID!, body: String!): PostType
    deleteComment(postId: ID, commentId: ID!): PostType
    like(postId: ID!): LikeType
  }
`;
