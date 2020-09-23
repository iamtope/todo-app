const grpc = require("grpc");

const TodoService = grpc.load("todo.proto").todo.TodoService

const client = new TodoService('localhost:50051', grpc.credentials.createInsecure())

module.exports = client