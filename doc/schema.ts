/*
--------------------------------------- CHANGE LOG ---------------------------------------
Date(DD/MM/YY)        Author    Version         Remarks
------------------------------------------------------------------------------------------
19/3/2024             AmerSyu    1.0.0           - Base version
*/

//From Lib
import { makeExecutableSchema } from "@graphql-tools/schema";
import merge from "lodash/merge";
import { typeDefs as MerchantDetail, resolvers as MerchantDetailResolver } from "./APISchema/test";

//Local Import
import { baseTypes } from "./APISchema/Base";

const schema = makeExecutableSchema({
    typeDefs: [baseTypes, MerchantDetail],
    resolvers : merge(MerchantDetailResolver)
})

export default schema;