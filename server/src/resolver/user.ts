import argon2 from "argon2";
import { Request, Response } from "express";
import { Redis } from "ioredis";
import { COOKIE_NAME } from "../constants";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

@InputType()
class LoginInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@InputType()
class RegisterInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class ErrorMessage {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => [ErrorMessage], { nullable: true })
  error?: ErrorMessage[];
}

interface UserContext {
  req: Request;
  res: Response;
  redis: Redis;
}

@Resolver(User)
export class UserResolver {
  // create user
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req }: UserContext
  ) {
    // invalidate input
    if (options.username.length < 3) {
      return {
        error: [
          {
            field: "username",
            message: "username must be at least three character!",
          },
        ],
      };
    }

    if (options.password.length < 3) {
      return {
        error: [
          {
            field: "password",
            message: "password must be at least three character!",
          },
        ],
      };
    }
    // TODO: set cookie
    const hashedPassword = await argon2.hash(options.password);
    let user;
    const userRepo = getRepository(User);
    try {
      user = await userRepo.save({
        username: options.username,
        password: hashedPassword,
      });
      req.session!.userId = user.id;
    } catch (error) {
      return {
        error: [
          {
            field: "username",
            message: "username already taken",
          },
        ],
      };
    }
    return { user };
  }

  //login user
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { req }: UserContext
  ) {
    const { username, password } = options;
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ username });
    if (!user) {
      return {
        error: [
          {
            field: "username",
            message: "user not exist!",
          },
        ],
      };
    }
    const pass = await argon2.verify(user.password, password);
    if (!pass) {
      return {
        error: [
          {
            field: "password",
            message: "wrong password!",
          },
        ],
      };
    }
    req.session!.userId = user.id;
    return { user };
  }

  // change password
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("username") username: string,
    @Arg("oldPassword") oldPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req }: UserContext
  ) {
    if (newPassword.length < 3) {
      return {
        error: [
          {
            field: "password",
            message: "new password must be at least three character!",
          },
        ],
      };
    }

    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ username });
    if (!user) {
      return {
        error: [
          {
            field: "username",
            message: "username don't exist!",
          },
        ],
      };
    }
    const pass = await argon2.verify(user.password, oldPassword);
    if (!pass) {
      return {
        error: [
          {
            field: "password",
            message: "old password is wrong",
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);
    try {
      await userRepo.save(user);
      req.session!.userId = user.id;
    } catch (err) {
      console.log(err);
    }

    return { user };
  }

  // change forgot password

  // logout user
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: UserContext) {
    return new Promise((resolve) => {
      req.session?.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  // check current user, me
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { req }: UserContext) {
    if (!req.session!.userId) {
      return null;
    }
    const userRepo = getRepository(User);
    return userRepo.findOne(req.session!.userId);
  }
}
