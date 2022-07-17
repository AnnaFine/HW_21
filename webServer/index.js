const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(cors());

app.use(bodyParser.json());
const port = 3000;

let todoList = [];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/todo-list/", (req, res) => {
  res.send(todoList);
});

app.post("/todo-list", (req, res) => {
  const { title } = req.body;
  const todo = {
    id: String(Date.now()),
    creationTime: new Date().toLocaleString(),
    title,
    checked: false,
  };
  todoList.push(todo);
  updateFileInformation();
  res.send(true);
});

app.put("/todo-list/:id", (req, res) => {
  const { checked, title } = req.body;
  const { id } = req.params;

  if (!id) {
    res.status(401).send("Id is required");
    return;
  }

  const foundToDo = todoList.find(({ id: currentId }) => currentId === id);

  if (!foundToDo) {
    res.status(401).send("Todo not found");
    return;
  }

  if (title) foundToDo.title = title;
  foundToDo.checked = !!checked;
  foundToDo.updatedTime = new Date().toLocaleString();
  updateFileInformation();
  res.send(true);
});

function updateFileInformation() {
  fs.writeFile("DataBase.txt", JSON.stringify(todoList), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function readInformation() {
  if (fs.existsSync("DataBase.txt")) {
    try {
      const data = fs.readFileSync("DataBase.txt", "utf8");
      todoList = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }
  }
}

app.listen(port, () => {
  readInformation();
  console.log(`Example app listening on port ${port}`);
});