import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Todo } from "../entity/todo";

@Resolver(Todo)
export class TodoResolver {
  // create with typeorm BaseEntity method
  @Mutation(() => Todo)
  async insertTodo(@Arg("content") content: string): Promise<Todo> {
    return Todo.create({ content: content, isFinished: false }).save();
  }

  // create with typeorm getRepository method
  @Mutation(() => Todo)
  async createTodo(@Arg("content") content: string) {
    // let newTodo = new Todo();
    // newTodo.content = content;
    // newTodo.isFinished = false;
    const todoRepo = getRepository(Todo);
    return await todoRepo.save({ content, isFinished: false });
  }

  // Read all
  @Query(() => [Todo])
  async allTodos() {
    const todoRepo = getRepository(Todo);
    return await todoRepo.find();
  }

  // Read one
  @Query(() => Todo)
  async todo(@Arg("id", () => Int) id: number) {
    const todoRepo = getRepository(Todo);
    return await todoRepo.findOne({ id });
  }

  // update
  @Mutation(() => Todo)
  async updateTodo(
    @Arg("id", () => Int) id: number,
    @Arg("content", () => String, { nullable: true }) content: string,
    @Arg("switchFinishState", () => Int, { nullable: true })
    switchFinishState: number
  ) {
    const todoRepo = getRepository(Todo);
    const todo = await todoRepo.findOne({ id });
    if (!todo) {
      return null;
    }
    if (content) {
      todo.content = content;
    }
    let isFinished = todo.isFinished;
    if (switchFinishState) {
      todo.isFinished = !isFinished;
    }
    return await todoRepo.save(todo);
  }

  // Delete
  @Mutation(() => Boolean)
  async deleteTodo(@Arg("id", () => Int) id: number) {
    const todoRepo = getRepository(Todo);
    let todo = await todoRepo.findOne(id);
    try {
      await todoRepo.remove(todo!);
    } catch (error) {
      console.log(error);
    }
    return true;
  }
}
