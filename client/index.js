import { load, credentials } from "grpc";

const TodoService = load("todo.proto").todo.TodoService

const client = new TodoService('localhost:50051', credentials.createInsecure());

export default client