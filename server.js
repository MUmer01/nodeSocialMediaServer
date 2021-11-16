const express = require("express");
const cors = require("cors");
const app = express();

const auth = require("./routes/auth");
const posts = require("./routes/posts");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/auth", auth);
app.use("/posts", posts);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000, () => {
  console.log("Server Started http://localhost:5000");
});
