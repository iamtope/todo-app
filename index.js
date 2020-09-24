import { load, Server, ServerCredentials } from "grpc";
import mongoose from "mongoose";
import { config } from "dotenv";
import Todo from "./todo.model";

const todoProto = load("proto/todo.proto");

config();

const db = process.env.DB;
console.log("the database string is", db);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((error) => {
    console.log("An error occurred while connecting to database", error);
  });

const addTodo = async (call, cb) => {
  try {
    const { todo: text } = call.request;
    const todo = new Todo({ text });
    const { id } = await todo.save();
    return cb(null, { id, todo: text });
  } catch (err) {
    cb(err);
  }
};

const getSingleTodo = async (call, cb) => {
  try {
    const { todoId } = call.request;
    const { id, text, updatedAt, createdAt } = await Todo.findById(
      todoId
    ).select("-__v");
    return cb(null, {
      id,
      text,
      updatedAt: updatedAt.toString(),
      createdAt: createdAt.toString(),
    });
  } catch (err) {
    cb(err);
  }
};

const editTodo = async (call, cb) => {
  try {
    const { todoId, todo } = call.request;
    const { id, text, updatedAt, createdAt } = await Todo.findOneAndUpdate(
      { _id: todoId },
      {
        $set: { text: todo },
      },
      { new: true }
    );
    return cb(null, {
      id,
      text,
      updatedAt: updatedAt.toString(),
      createdAt: createdAt.toString(),
    });
  } catch (err) {
    cb(err);
  }
};

const deleteTodo = async (call, cb) => {
  try {
    const { todoId } = call.request;
    await Todo.findOneAndDelete({ _id: todoId });
    return cb(null);
  } catch (err) {
    cb(err);
  }
};

const server = new Server();

server.addService(todoProto.todo.TodoService.service, {
  create: addTodo,
  GetTodo: getSingleTodo,
  EditTodo: editTodo,
  DeleteTodo: deleteTodo
});

server.bind("0.0.0.0:50051", ServerCredentials.createInsecure());
console.log("Server running at http://0.0.0.0:50051");
server.start();
