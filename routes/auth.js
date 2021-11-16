const express = require("express");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const router = express.Router();

const users = [];

router.get("/", (req, res) => {
  res.send(users);
});

router.post("/register", (req, res) => {
  const newID = new Date().getTime();
  const username = req.body.username;
  const email = req.body.email;
  const password = md5(req.body.password);
  const isMatch = users.some(
    (user) => user.username === username || user.email === email
  );
  if (isMatch) {
    res.status(409).send({ message: "Username or email already exist!" });
  } else {
    users.push({
      userId: newID,
      username,
      email,
      password,
    });
    res.status(200).send({
      message: "User created successfully",
      userId: newID,
    });
  }
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);
  const currentUser = users.find((user) => {
    return user.username === username && user.password === password;
  });
  if (currentUser) {
    // const copyUser = JSON.parse(JSON.stringify(currentUser)); // Deep copy
    const copyUser = { ...currentUser }; // shalow copy
    delete copyUser.password;
    jwt.sign(
      { user: copyUser },
      "secretkey",
      { expiresIn: "24h" },
      (error, token) => {
        if (error) {
          res.status(400);
          res.send({ message: "Login failed!" });
        } else {
          res.send({
            token: token,
            loggedIn: true,
            user: copyUser,
          });
        }
      }
    );
  } else {
    res.status(401);
    res.json({ loggedIn: false, message: "Invalid username or password!" });
  }
});

module.exports = router;
