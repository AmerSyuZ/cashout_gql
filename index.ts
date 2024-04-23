/*
--------------------------------------- CHANGE LOG ---------------------------------------
Date(DD/MM/YY)        Author    Version         Remarks
------------------------------------------------------------------------------------------
19/3/2024             AmerSyu    1.0.0           - Base version
*/

// From packages
import express from "express";
import http from "http"
import { json, raw, text, urlencoded } from "body-parser";
import schedule from "node-schedule";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import cors from "cors";
import mongoose from 'mongoose';

// Apollo Server Plugin
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// Self created imports
import { ENVIRONMENT, PLAYGROUND_ENABLED, PORT, SUBPATH } from "./env/envVariable";
import logging from "./Logging";
import schema from "./doc/schema";
import { csvHandler } from "./cronjob/csvHandler";


const cronLog = logging("cron");
const APILog = logging("API");
const defaultLog = logging("default");
const errorLog = logging("error");

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  //Declare received data type and size
  app.use(
    text({ limit: "5mb" }),
    json({ limit: "5mb" }),
    raw({ limit: "5mb" }),
    urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }),
    graphqlUploadExpress({
      maxFieldSize: 3000000,
      maxFileSize: 5242880,
      maxFiles: 20,
    })
  );

  app.use((req, res, next) => {
    // console.log("req", req);
    // console.log("res", res);
    if (
      req.method === "POST" &&
      !req.headers["orisourcesystem"] &&
      !(
        req.headers["referer"] &&
        req.headers["content-type"] &&
        req.headers["content-type"].startsWith("multipart/form-data;")
      )
    ) {

      //Unecrypted response send function
      const originalSend = res.send.bind(res)
      req.body = JSON.parse(req.body)
      res.send = (data) => {
        try {
          // Log information
          APILog.info("Requested body:", req.body);
          APILog.info("Response data:", data);

          // Call the original `send` method
          return originalSend(data);
        } catch (err) {
          next(err); // Forward error to error-handling middleware
        }
      };
    }
    next();
  });

  process.setMaxListeners(15);

  server.listen({ port: PORT || 4000 }, () => {
    defaultLog.info(
      `ENVIRONMENT: ${ENVIRONMENT} \n🚀 Server started at ${SUBPATH}/api and listening at port ${PORT}`
    );
  });

  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = 6;
  rule.hour = 17;
  rule.minute = 0;

  schedule.scheduleJob(
    {
      rule, // Every Sunday at 17:00
      timezone: "Asia/Kuala_Lumpur",
    },
    async () => {

    }
  );

  const apollo = new ApolloServer({
    csrfPrevention: true,
    introspection: PLAYGROUND_ENABLED,
    schema,
    formatError: (formattedErr) => {
      return {
        ...formattedErr,
        message:
          formattedErr.extensions.code ===
            ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
            ? formattedErr.message
            : "defaultErrorMsg",
      };
    },
    plugins: [
      {
        async contextCreationDidFail({ error }) {
          cronLog.error(`Context creation failed !!! : ${error}`);
        },
      },
      ApolloServerPluginDrainHttpServer({ httpServer: server }),
    ],
  });

  await apollo.start();

  app.use(
    `${SUBPATH}/api`,
    cors<cors.CorsRequest>({
      credentials: false,
    }),
    expressMiddleware(apollo, {
      context: async ({ req }) => {

        const result = {
          LANG: req.headers.lang ? req.headers.lang.toString() : "en",
          browserName: req.headers.browsername || "",
          browserVersion: req.headers.browserversion || "",
        };
        return result;
      },
    })
  );

}

async function connectDb() {

  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: process.env.DB_NAME
      })
      .then(() => {
        defaultLog.info(`Pinged your deployment. You successfully connected to MongoDB! connected to ${process.env.DB_NAME}`);
      })
  } catch (err) {
    errorLog.error(`Error establishing connection to MongoDB :: ${err}`)
  }
}

connectDb();
startServer();
// csvHandler();


export { defaultLog, cronLog, APILog };