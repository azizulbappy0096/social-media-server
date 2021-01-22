const { AuthenticationError, UserInputError } = require("apollo-server");
const postModel = require("../../models/Post");
const checkAuthorization = require("../../utils/checkAuth");

module.exports = {
  // ---Post query-resolvers--- //
  Query: {
    //  ---get all post--- //
    getPosts: async () => {
      try {
        const allPosts = await postModel.find({});
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
      try {
        const newPost = new postModel({
          username: user.username,
          body,
          createdAt: new Date().toISOString(),
          user: user.id,
        });

        const response = await newPost.save();

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
  },
};
