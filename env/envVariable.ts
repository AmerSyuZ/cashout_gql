/*
--------------------------------------- CHANGE LOG ---------------------------------------
Date(DD/MM/YY)        Author      Version         Remarks
------------------------------------------------------------------------------------------
19/03/2024            AmerSyu       1.0.0           - Base version
*/

import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/.env` });
dotenv.config({
  path: `${__dirname}/${process.env.NODE_ENV}.env`,
  override: true,
});

const getBool = (val: string) => !!val && val.trim().toLowerCase() === "true";

export const PORT = process.env.PORT;
export const PLAYGROUND_ENABLED = getBool(process.env.PLAYGROUND_ENABLED);
export const SUBPATH = process.env.SUBPATH;
export const ENVIRONMENT = process.env.ENVIRONMENT;
export const MAP_API_KEY = process.env.MAP_API_KEY;
