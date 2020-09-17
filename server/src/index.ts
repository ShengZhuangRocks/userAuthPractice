import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Todo } from "./entity/todo";
import { HelloResolver } from "./resolver/hello";
import { TodoResolver } from "./resolver/todo";
import path from "path";
import { UserResolver } from "./resolver/user";
import { User } from "./entity/User";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import { COOKIE_NAME, __prod__ } from "./constants";

const main = async () => {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "userauthpractice",
    synchronize: true,
    logging: true,
    entities: [Todo, User],
    migrations: [path.join(__dirname, "/src/migration")],
  });

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // connect redis to session
  const RedisStore = connectRedis(session);
  // create redis client / check ioRedis
  const redis = new Redis();
  // session config
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "some secrect string",
      resave: false,
    })
  );

  console.log(__prod__);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, TodoResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("graphql server started on http://localhost:4000/graphql");
  });
};

//
main().catch((err) => console.error(err));
