import React, { useState, useMemo } from "react"; // import Pagination from '../Pagination';
import "./App.css";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { gql, useMutation, useQuery } from "@apollo/client";
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

const UPDATE_CONTACT = gql`
  mutation updateContact(
    $updateContactId: ID!
    $firstName: String
    $lastName: String
    $email: String
    $phoneNumber: String
  ) {
    updateContact(
      id: $updateContactId
      firstName: $firstName
      lastName: $lastName
      email: $email
      phoneNumber: $phoneNumber
    ) {
      id
      email
      firstName
      lastName
      phoneNumber
    }
  }
`;

export default function App() {
  const [selectedContact, setSelectedContact] = React.useState<any | null>(
    null
  );
  const [selectedFirstName, setSelectedFirstName] = React.useState<string>("");
  const [selectedLastName, setSelectedLastName] = React.useState<string>("");
  const [selectedEmail, setSelectedEmail] = React.useState<string>("");
  const [selectedPhoneNumber, setSelectedPhoneNumber] =
    React.useState<string>("");

  React.useEffect(() => {
    if (selectedContact) {
      setSelectedFirstName(selectedContact.firstName);
      setSelectedLastName(selectedContact.lastName);
      setSelectedEmail(selectedContact.email);
      setSelectedPhoneNumber(selectedContact.phoneNumber);
    }
  }, [selectedContact]);

  const { error, data, loading } = useQuery(GET_CONTACTS);
  const [updateContact] = useMutation(UPDATE_CONTACT, {
    variables: {
      updateContactId: selectedContact?.id,
      firstName: selectedFirstName,
      lastName: selectedLastName,
      email: selectedEmail,
      phoneNumber: selectedPhoneNumber,
    },
    refetchQueries: [
      {
        query: GET_CONTACTS,
      },
    ],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleUpdate = () => {
    updateContact().then((res) => {
      setSelectedContact(res.data.updateContact);
    });
  };

  const handleUpdateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFirstName(e.target.value);
  };

  const handleUpdateLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLastName(e.target.value);
  };

  const handleUpdateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEmail(e.target.value);
  };

  const handleUpdatePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPhoneNumber(e.target.value);
  };

  const canUpdate = () => {
    return (
      selectedFirstName !== selectedContact.firstName ||
      selectedLastName !== selectedContact.lastName ||
      selectedEmail !== selectedContact.email ||
      selectedPhoneNumber !== selectedContact.phoneNumber
    );
  };

  return (
    <div className="App">
      <ContactTable
        data={data.contacts}
        selectedId={selectedContact ? selectedContact.id : null}
        selectContact={setSelectedContact}
      />
      {selectedContact && (
        <div className="selectedContainer">
          <h1>Selected Contact Details</h1>

          <span>
            <label>First Name: </label>
            <input
              type="text"
              value={selectedFirstName}
              onChange={handleUpdateFirstName}
            />
          </span>

          <span>
            <label>Last Name: </label>
            <input
              type="text"
              value={selectedLastName}
              onChange={handleUpdateLastName}
            />
          </span>

          <span>
            <label>Email: </label>
            <input
              type="text"
              value={selectedEmail}
              onChange={handleUpdateEmail}
            />
          </span>

          <span>
            <label>Phone Number: </label>
            <input
              type="text"
              value={selectedPhoneNumber}
              onChange={handleUpdatePhoneNumber}
            />
          </span>

          <button disabled={!canUpdate()} onClick={handleUpdate}>
            Update
          </button>
        </div>
      )}
    </div>
  );
}
