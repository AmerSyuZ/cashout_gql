import MerchantDetailModel from "../MongoDBModel/test"

export const typeDefs = `#graphql
    type MerchantDetail {
        Merchant: String
        State: String
        State_Abbreviation: String
        Lat: String
        Lang: String
    }

    type MerchantDetailResponse {
      code: String
      success: Boolean
      message: String
      result: JSON
    }

    input MerchantDetailInput {
        Merchant: String
        State: String
        State_Abbreviation: String
        Lat: String
        Lang: String
    }

    input EditMerchantDetailInput {
        Merchant: String
        State: String
        State_Abbreviation: String
    }

    type Query {
        merchantDetail(ID:ID!): MerchantDetail!
        getMerchantDetails(amount:Int): MerchantDetailResponse
    }

    type Mutation {
        createMerchantDetail(merchantDetailInput: MerchantDetailInput) : MerchantDetail!
        deleteMerchantDetail(ID: ID!): Boolean
        editMerchantDetail(ID:ID!, editMerchantDetailInput: EditMerchantDetailInput) : Boolean
    }
`

export const resolvers = {
  Query: {
    async merchantDetail(_, { ID }) {
      return await MerchantDetailModel.findById(ID)
    },
    async getMerchantDetails(_, { amount }) {
      return {
        result: await MerchantDetailModel.find().sort({ createdAt: 1 }).limit(amount),
        success: true,
        code: 200,
        message: ""
      }
    }
  },
  Mutation: {
    async createMerchantDetail(_, { merchantDetailInput: { Merchant, State, State_Abbreviation, Lat, Lang } }) {
      const createdMerchantDetail = new MerchantDetailModel({
        Merchant: Merchant,
        State: State,
        State_Abbreviation: State_Abbreviation,
        Lat: Lat,
        Lang: Lang
      });

      const res = await createdMerchantDetail.save();

      return {
        result: res,
        success: true,
        code: 200
      }
    },

    async deleteMerchantDetail(_, { ID }) {
      const wasDeleted = (await MerchantDetailModel.deleteOne({ _id: ID })).deletedCount;
      return wasDeleted;
      //return 1 if deleted, 0 if nothing was deleted
    },

    async editMerchantDetail(_, { ID, editMerchantDetailInput: { Merchant, State, State_Abbreviation } }) {
      const wasEdited =
        (await MerchantDetailModel
          .updateOne(
            { _id: ID },
            {
              Merchant: Merchant,
              State: State,
              State_Abbreviation: State_Abbreviation
            })).modifiedCount;
      return wasEdited;
      //return 1 if deleted, 0 if nothing was deleted

    }
  }
}