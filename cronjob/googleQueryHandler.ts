/*
--------------------------------------- CHANGE LOG ---------------------------------------
Date(DD/MM/YY)        Author    Version         Remarks
------------------------------------------------------------------------------------------
19/3/2024             AmerSyu    1.0.0           - Base version
*/

import { cronLog } from "..";
import { MAP_API_KEY } from "../env/envVariable";

export const googleLatLangHandler = async (address) => {
  const formattedAddress = address.replace(/\s/g, "+");
  try {
    let JsonData;
     await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${MAP_API_KEY}`).
      then(response => response.json()).
      then(json => {
        JsonData = json;
      });
      return JsonData.results[0].geometry.location;
  } catch (err) {
    cronLog.error(`=======googleQueryHandler Error : Fetch Error || Google API Error :: ${err}=======`);
  }
}