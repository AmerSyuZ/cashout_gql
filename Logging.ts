/*
--------------------------------------- CHANGE LOG ---------------------------------------
Date(DD/MM/YY)        Author    Version         Remarks
------------------------------------------------------------------------------------------
                                 1.0.0           - Base version
08/08/2023            GohWZ      1.0.1           - Redo whole log manager, 1 for cron job, 1 for API, 1 for debugging / testing


*/

import { configure, getLogger } from "log4js";
// Ref: https://log4js-node.github.io/log4js-node/api.html

// patterns may refer to: https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/PatternLayout.html
configure({
  appenders: {
    default: {
      type: "stdout",
      layout: {
        type: "pattern",
        pattern: "%m",
      },
    },
    cron: {
      type: "dateFile",
      numBackups: 7,
      compress: true,
      filename: "log/cron.log",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} %p %m",
      },
    },
    API: {
      type: "dateFile",
      numBackups: 7,
      compress: true,
      filename: "log/API.log",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} %p %m",
      },
    },
    error: {
      type: "dateFile",
      numBackups: 7,
      compress: true,
      filename: "log/error.log",
      layout: {
        type: "pattern",
        pattern: "%d{yyyy-MM-dd hh:mm:ss.SSS} %p %m",
      },
    },
  },

  categories: {
    error: { appenders: ["error"], level: "INFO" },
    cron: { appenders: ["cron"], level: "INFO" },
    API: { appenders: ["API"], level: "INFO" },
    default: { appenders: ["default"], level: "INFO" },
    // Level specificed here has higher priority
  },
  pm2: true,
});

const logging = (categoryName?: "cron" | "API" | "default" | "error") =>
  getLogger(categoryName);

export default logging;
