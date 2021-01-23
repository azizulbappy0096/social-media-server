const { AuthenticationError, UserInputError } = require("apollo-server");
const postModel = require("../../models/Post");
const checkAuthorization = require("../../utils/checkAuth");

module.exports = {
  // PostType modifier
  PostType: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },

  // ---Post query-resolvers--- //
  Query: {
    //  ---get all post--- //
    getPosts: async () => {
      try {
        const allPosts = await postModel.find({}).sort([["createdAt", -1]]);
        return allPosts;
      } catch (error) {
        throw new Error(error);
      }
    },

    // ---get post by ID--- //
    getPost: async (_, { postId }, context, info) => {
      console.log(context.headers);
      try {
        const post = await postModel.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  //   ---post mutation resolvers--- //
  Mutation: {
    // ---add post--- //
    addPost: async (_, { body }, context, info) => {
      const user = checkAuthorization(context);
      if (body.trim() === "") {
        throw new UserInputError("Body must not be empty", {
          errors: {
            body: "Can't use empty body",
          },
        });
      }

      try {
        const newPost = new postModel({
          username: user.username,
          body,
          createdAt: new Date().toISOString(),
          user: user.id,
        });

        const response = await newPost.save();
        context.pubsub.publish("NEW_POST", { newPost: response });
        return response;
      } catch (error) {
        throw new Error(error);
      }
    },

    // ---delete post ny ID--- //
    deletePost: async (_, { postId }, context) => {
      const user = checkAuthorization(context);

      try {
        const post = await postModel.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Deleted succesfully";
        } else {
          throw new AuthenticationError("Action is not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    // ---add comment to an existing post--- //
    addComment: async (_, { postId, body }, context, info) => {
      const { username } = checkAuthorization(context);
      try {
        if (body.trim() !== "") {
          const post = await postModel.findById(postId);
          if (post) {
            post.comments.unshift({
              username,
              body,
              createdAt: new Date().toISOString(),
            });

            await post.save();
            return post;
          } else throw new Error("No post found");
        } else
          throw new UserInputError("Can't comment empty String", {
            errors: {
              comment: "Expected string but found empty",
            },
          });
      } catch (error) {
        throw new Error(error);
      }
    },

    // delete an existing comment
    deleteComment: async (_, { postId, commentId }, context, info) => {
      const { username } = checkAuthorization(context);

      try {
        const post = await postModel.findById(postId);
        if (!post) {
          throw new UserInputError("Post not found!!", {
            errors: {
              post: "Post is not available anymore.",
            },
          });
        }

        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Not allowed", {
            errors: {
              accessDenied:
                "User is not authorized to modify/populate the comment",
            },
          });
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    // toggle post likes
    like: async (_, { postId }, context, info) => {
      const { username } = checkAuthorization(context);
      try {
        const post = await postModel.findById(postId);
        if (!post) {
          throw new UserInputError("Post not found!!", {
            errors: {
              post: "Post is not available anymore.",
            },
          });
        }
        if (post.likes.find((user) => user.username === username)) {
          const likedIndex = post.likes.findIndex(
            (like) => like.username === username
          );
          post.likes.splice(likedIndex, 1);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  // subscription

  Subscription: {
    // new post subscription
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(["NEW_POST"]),
    },
  },
};
