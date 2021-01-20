const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();
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

// const typeDefs = gql`
//   type Query {
//     sayHi: String!,
    
//   }
// `;

// const typeDefs1 = gql`
//   extend type Query {
//     say: String!
//   }
// `;

// const resolvers = {
//   Query: {
//     sayHi: () => "Hello World",
//   },
// };

// const resolvers1 = {
//     Query: {
//       say: () => "Hello 1",
//     },
//   };

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers
});

server.listen({ port: 5000 }).then((res) => {
  console.log(`Server is running on port: ${res.url}`);
});
