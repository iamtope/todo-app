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
          message: "It went wrong for you",
        })
      : res.status(200).json({
          status: "success",
          data: todo,
        })
  );
});

app.get("/todo/:todoId", (req, res) => {
  client.GetTodo({ todoId: req.params.todoId }, (err, todo) => {
    err
      ? res.status(500).json({
          status: "fail",
          message: "It went wrong for you",
        })
      : res.status(200).json({
          status: "success",
          data: todo,
        });
  });
});

app.patch("/todo/:todoId", (req, res) => {
  client.EditTodo(
    { todoId: req.params.todoId, todo: req.body.text },
    (err, todo) => {
      err
        ? res.status(500).json({
            status: "fail",
            message: "It went wrong for you",
          })
        : res.status(200).json({
            status: "success",
            data: todo,
          });
    }
  );
});

app.delete("/todo/:todoId", (req, res) => {
  client.DeleteTodo({ todoId: req.params.todoId }, (err) => {
    err
      ? res.status(500).json({
          status: "fail",
          message: "It went wrong for you",
        })
      : res.status(200).json({
          status: "success",
        });
  });
});

app.listen(4500, () => {
  console.log("I am grpcing on 4500");
});
