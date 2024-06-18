// server/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Client = require("./models/Client");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://webappuser:securepassword@localhost:27017/webapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Регистрация пользователей
app.post("/api/register", async (req, res) => {
  const { fullName, login, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ fullName, login, password: hashedPassword });
  await user.save();
  res.status(201).send(user);
});

// Авторизация пользователей
app.post("/api/login", async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { userId: user._id, fullName: user.fullName },
      "secretkey"
    );
    res.send({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Получение клиентов для авторизованного пользователя
app.get("/api/clients", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { fullName } = jwt.verify(token, "secretkey");
  const clients = await Client.find({ responsiblePerson: fullName });
  res.send(clients);
});

// Обновление статуса клиента
app.put("/api/clients/:id/status", async (req, res) => {
  const { status } = req.body;
  await Client.findByIdAndUpdate(req.params.id, { status });
  res.send("Status updated");
});

// Добавление нового клиента
app.post("/api/clients", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { fullName } = jwt.verify(token, "secretkey");
  const {
    accountNumber,
    lastName,
    firstName,
    middleName,
    birthDate,
    inn,
    innType,
    responsiblePerson,
    status,
  } = req.body;
  const client = new Client({
    accountNumber,
    lastName,
    firstName,
    middleName,
    birthDate,
    inn,
    innType,
    responsiblePerson: fullName,
    status: "Не в работе",
  });
  await client.save();
  res.status(201).send(client);
});

// Удаление клиента
app.delete("/api/clients/:id", async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.send("Client deleted");
});

app.listen(5000, () => console.log("Server started on port 5000"));
