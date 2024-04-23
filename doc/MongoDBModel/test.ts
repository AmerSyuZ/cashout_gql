
import { Decimal128 } from "mongodb";
import { model, Schema } from "mongoose";

//This is a mongoose Model Schema Declaration. To maintain a uniform collection's data.
const testSchema = new Schema({
    Merchant: String,
    State: String,
    State_Abbreviation: String,
    Lat: String,
    Lang: String,
})

//Declare which collection you want this model to be added. 
//In this case "Location" is the mongodb collection that we
// want the data to be stored to.
export default model('location', testSchema);