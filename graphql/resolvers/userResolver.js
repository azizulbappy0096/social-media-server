const userModel = require("../../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const { registerValidator } = require("../../utils/validator");

module.exports = {

  Mutation: {
    register: async (
      _,
      { username, email, password, confirmPassword },
      context,
      info
    ) => {
      try {
        const { errors, valid } = registerValidator(username, email, password, confirmPassword)

        if(!valid) {
          console.log(errors)
          throw new UserInputError('Validation errors', {errors});
          
        }

        let exist = await userModel.findOne({ "username": username});

        if(exist) {
            throw new UserInputError('Username is already taken', {
                errors: {
                    username: "This username is not available"
                }
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

        const token = jwt.sign(
          {
            id: response._id,
            username: response.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

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
  },
};
