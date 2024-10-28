import React, { useState, useMemo } from "react"; // import Pagination from '../Pagination';
import "./App.css";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { gql, useQuery } from "@apollo/client";
import { ContactTable } from "./client/components/ContactTable";

export const getRange = (start: number, end: number, max: number) => {
  if (start < 1) {
    const diff = 1 - start;
    start = 1;
    end += diff;
  }

  if (end > max) {
    end = max;
    start = max - 4;
  }

  const length = end - start + 1;
  return Array.from({ length: length }, (_, idx) => idx + start);
};

const GET_CONTACTS = gql`
  query getAllContacts {
    contacts {
      id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;

const GET_CONTACT = gql`
  query getAllContacts {
    contacts {
      id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;

export default function App() {
  const [selectedContact, setSelectedContact] = React.useState<any | null>(
    null
  );
  const { error, data, loading } = useQuery(GET_CONTACTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="App">
      <ContactTable
        data={data.contacts}
        selectedId={selectedContact ? selectedContact.id : null}
        selectContact={setSelectedContact}
      />
      {selectedContact && (
        <div>
          <h2>Selected Contact Details</h2>
          <p>First Name: {selectedContact.firstName}</p>
          <p>Last Name: {selectedContact.lastName}</p>
          <p>Email: {selectedContact.email}</p>
          <p>Phone Number: {selectedContact.phoneNumber}</p>
        </div>
      )}
    </div>
  );
}
