import Todo from "./todo.model";
const grpc = require("grpc");
const todoProto = grpc.load("proto/todo.proto");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db = process.env.DB;
console.log("the database string is", db);

mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch(error => {
    console.log("An error occurred while connecting to database", error);
  });

const server = new grpc.Server();

server.addService(todoProto.todo.TodoService.service, {
  create(call, cb) {
    const { todo: text } = call.request;
    const todo = new Todo({ text });
    todo
      .save()
      .then(doc => {
        cb(null, { id: todo.id, todo: text });
      })
      .catch(err => cb(err));
  }
});

server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://0.0.0.0:50051");
server.start();
