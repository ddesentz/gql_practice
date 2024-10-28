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

  type Mutation {
    updateContact(id: ID!, firstName: String, lastName: String, email: String, phoneNumber: String): Contact
  }
`;

const resolvers = {
  Query: {
    contacts: () => contacts,
    contact: (_: any, { id }: { id: number }) => {
      return contacts.find((contact) => Number(contact.id) === Number(id));
    },
  },
  Mutation: {
    updateContact: (
      _: any,
      { id, firstName, lastName, email, phoneNumber }: any
    ) => {
      const contact = contacts.find(
        (contact) => Number(contact.id) === Number(id)
      );
      if (contact) {
        contact.firstName = firstName || contact.firstName;
        contact.lastName = lastName || contact.lastName;
        contact.email = email || contact.email;
        contact.phoneNumber = phoneNumber || contact.phoneNumber;
      }
      return contact;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);
