import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import contacts from "../db/mock-data.json";

const typeDefs = `#graphql
  type Contact {
    id: ID!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
  }

  type Query {
    contacts: [Contact]
    contact(id: ID!): Contact
  }
`;

const resolvers = {
  Query: {
    contacts: () => contacts,
    contact: (_: any, { id }: { id: number }) => {
      return contacts.find((contact) => Number(contact.id) === Number(id));
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);
