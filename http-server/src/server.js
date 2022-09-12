import express from "express";

const app = express();

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/*", (req, res) => res.redirect("/"));

const handleServerListen = () => {
  console.log("listening port 3000");
};

app.listen(3000, handleServerListen);
