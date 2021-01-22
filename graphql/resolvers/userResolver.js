const userModel = require("../../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { registerValidator, loginValidator } = require("../../utils/validator");

// generate jwt token for auth
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )
}

module.exports = {

  // user mutations
  Mutation: {

    // user register resolver
    register: async (
      _,
      { username, email, password, confirmPassword },
      context,
      info
    ) => {
      try {
        const { errors, valid } = registerValidator(
          username,
          email,
          password,
          confirmPassword
        );

        if (!valid) {
          console.log(errors);
          throw new UserInputError("Validation errors", { errors });
        }

        let exist = await userModel.findOne({ username: username });

        if (exist) {
          throw new UserInputError("Username is already taken", {
            errors: {
              username: "This username is not available",
            },
          });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new userModel({
          username,
          email,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
        });

        const response = await newUser.save();

        const token = generateToken(response);

        return {
          id: response._id,
          token,
          username: response.username,
          email: response.email,
          createdAt: response.createdAt,
        };
      } catch (error) {
        throw new Error(error);
      }
    },

    // user login resolver
    login: async (_, { username, password }, context, info) => {
      try {
        const { errors, valid } = loginValidator(username, password);

        if (!valid) {
          console.log(errors);
          throw new UserInputError("Validation errors", { errors });
        }

        const user = await userModel.findOne({ username });

        if (!user) {
          throw new AuthenticationError("Authentication errors", {
            error: "username or password is incorrect",
          });
        }
        const isAuth = await bcryptjs.compare(password, user.password);
        if (!isAuth) {
          throw new AuthenticationError("Authentication errors", {
            error: "username or password is incorrect",
          });
        }
        const token = generateToken(user);

        return {
          id: user._id,
          token,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
