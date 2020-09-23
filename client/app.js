import express, { json, urlencoded } from "express";
import client from "./index";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.post("/todo", (req, res) => {
  client.create({ todo: req.body.text }, (err, todo) =>
    err
      ? res.status(500).json({
          status: "fail",
          message: "It went wrong for you"
        })
      : res.status(200).json({
          status: "success",
          data: todo
        })
  );
});

app.listen(4500, () => {
  console.log("I am grpcing on 4500");
});
