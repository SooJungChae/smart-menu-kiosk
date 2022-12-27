import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { WebApp } from 'meteor/webapp';

import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

import resolverItem from "../api/item/resolvers";
import resolverOrder from "../api/order/resolvers";
import typeDefItem from "../api/item/schemas";
import typeDefOrder from "../api/order/schemas";

(async function() {

  const typeDefs = [typeDefItem, typeDefOrder];
  const resolvers = [resolverItem, resolverOrder];
  
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
  
  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: async (connectionParams, websocket, context) => {
      console.log(`Subscription client connected`);
    },
    onDisconnect: async (WebSocket, context) => {
      console.log(`Subscription client disconnected`);
    }
  }, {
    server: WebApp.httpServer,
    path: '/graphql'
  })
  
  const server = new ApolloServer({
    schema,
    context: '',
  });
  
  await server.start();
  
  server.applyMiddleware({
    playground: true,
    app: WebApp.connectHandlers,
    cors: true,
    path: '/graphql',
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            }
          }
        }
      }
    ]
  })
})()