// backend.js
import cors from "cors";
import express from "express";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.use(cors());
app.use(express.json());

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    user => user["name"] === name
      && user["job"] === job
  );
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUsersByJob = (job) => {
  return users["users_list"].filter(
    user => user["job"] === job
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex(user => user.id === id);
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true;
  }
  return false;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  if (!userToAdd.id || !userToAdd.name || !userToAdd.job) {
    return res.status(400).send("Invalid user data. Ensure id, name, and job are provided.");
  }

  addUser(userToAdd);
  res.status(201).json(userToAdd); // Send 201 status with the new user data
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const isDeleted = deleteUserById(id);
  
  if (isDeleted) {
    res.status(200).send(`User with id ${id} deleted.`);
  } else {
    res.status(404).send(`User with id ${id} not found.`);
  }
});


app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name && job) {
    const result = { users_list: findUsersByNameAndJob(name, job) };
    return res.json(result);
  }

  if (name) {
    const result = { users_list: findUserByName(name) };
    return res.json(result);
  }

  if (job) {
    const result = { users_list: findUsersByJob(job) };
    return res.json(result);
  }

  res.json(users);
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

