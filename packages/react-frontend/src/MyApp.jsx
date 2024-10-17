// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
  

  function removeOneCharacter(index) {
    const characterToRemove = characters[index];  // Get the character by index
    const id = characterToRemove.id;  // Extract the ID of the character

    // Send DELETE request to backend with ID
    deleteUserById(id)
      .then((response) => {
        if (response.status === 204) {
          // Successfully deleted from backend, now update the frontend state
          const updatedCharacters = characters.filter((character, i) => i !== index);
          setCharacters(updatedCharacters);  // Update state by removing the deleted user
        } else if (response.status === 404) {
          console.error("User not found. Deletion failed.");
        }
      })
      .catch((error) => {
        console.error("Error deleting the user: ", error);
      });
  }

  // Function to send DELETE request to backend
  function deleteUserById(id) {
    return fetch(`http://localhost:8000/users/${id}`, {  // Use template literal to construct URL with ID
      method: 'DELETE',
    });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json(); 
        } else {
          throw new Error("Failed to add user. Server did not return 201 Created.");
        }
      })
      .then((newUser) => {
        setCharacters([...characters, newUser]); // Update state with the new user
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
  
    return promise;
  }

}

export default MyApp;
