// import modules
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

// typdefs and resolvers
const typeDefs = require("./graphql/query/query");
const resolvers = require("./graphql/resolvers/resolvers");

// connect to MongoDB
mongoose.connect(
  process.env.MONGODB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connect to MongoDB")
);

// set-up apollo-server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

// start listening server on port 5000
server.listen({ port: 5000 }).then((res) => {
  console.log(`Server is running on port: ${res.url}`);
});
