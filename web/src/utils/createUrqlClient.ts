import { dedupExchange, errorExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import {
  LoginMutation,
  CurrentUserQuery,
  CurrentUserDocument,
  RegisterMutation,
  ChangePasswordMutation,
  LogoutMutation,
} from "../generated/graphql";

export const createUrqlClient = (ssrExchange: any) => {
  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
    },
    exchanges: [
      cacheExchange({
        updates: {
          Mutation: {
            register: (_result, args, cache, info) => {
              // console.log("cache result: ", _result);
              // console.log("cache args: ", args);
              // console.log("cache: ", cache);
              // console.log("cache info: ", info);
              betterUpdateQuery<RegisterMutation, CurrentUserQuery>(
                cache,
                { query: CurrentUserDocument },
                _result,
                (result, query) => {
                  // result: login mutation result
                  // query: currentUser query in cache
                  if (result.register.error) {
                    return query;
                  } else {
                    return {
                      currentUser: result.register.user,
                    };
                  }
                }
              );
            },

            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, CurrentUserQuery>(
                cache,
                { query: CurrentUserDocument },
                _result,
                (result, query) => {
                  if (result.login.error) {
                    return query;
                  } else {
                    return {
                      currentUser: result.login.user,
                    };
                  }
                }
              );
            },

            changePassword: (_result, args, cache, info) => {
              betterUpdateQuery<ChangePasswordMutation, CurrentUserQuery>(
                cache,
                { query: CurrentUserDocument },
                _result,
                (result, query) => {
                  if (result.changePassword.error) {
                    return query;
                  } else {
                    return {
                      currentUser: result.changePassword.user,
                    };
                  }
                }
              );
            },

            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, CurrentUserQuery>(
                cache,
                { query: CurrentUserDocument },
                _result,
                () => ({ currentUser: null })
              );
            },
          },
        },
      }),
      ssrExchange,
      fetchExchange,
      dedupExchange,
    ],
  };
};
