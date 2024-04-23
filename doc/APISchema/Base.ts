/*
--------------------------------------- CHANGE LOG ---------------------------------------
Date(DD/MM/YY)        Author    Version         Remarks
------------------------------------------------------------------------------------------
                                 1.0.0           - Base version
*/

import { generalResp } from "../methods/config";

const resp = ``;

export const baseTypes = `#graphql
  scalar JSON
  scalar Upload

  type baseResponse {
    ${generalResp}
    ${resp}
  }

  type Query {
    base: baseResponse
  }

  type Mutation {
    base: baseResponse
  }
`;