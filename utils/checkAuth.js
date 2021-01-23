const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

// authenticate user based on jwt token
const checkAuthorization = ({ req }) => {
  const authheader = req.headers.authorization;

  if (authheader) {
    const token = authheader.split("Bearer ")[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
      } catch (err) {
        throw new AuthenticationError("Invalid token");
      }
    } else {
      throw new AuthenticationError(
        "Authentication header must be 'Bearer [token]'"
      );
    }
  } else {
    throw new AuthenticationError("Authentication token must be provided");
  }
};

module.exports = checkAuthorization;
