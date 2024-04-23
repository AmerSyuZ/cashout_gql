/*
--------------------------------------- CHANGE LOG ---------------------------------------
Date(DD/MM/YY)        Author    Version         Remarks
------------------------------------------------------------------------------------------
19/3/2024             AmerSyu    1.0.0           - Base version
*/

//for csvhandler
import { parse } from "csv/sync";
import fs from 'node:fs';
import { cronLog } from "..";
import { googleLatLangHandler } from "./googleQueryHandler";
import { convertArrayToCSV } from "convert-array-to-csv";

export const csvHandler = async () => {
  const records = await csvReader("sample_place.csv");
  // console.log(records);
  // const generatedres = await googleLatLangHandler(records[1].join());
  // console.log(generatedres)
  csvGenerator(records);
}

const csvReader = async (fileName) => {
  try {
    const readFile = await fs.readFileSync(`./data/${fileName}`);
    if (readFile) {
      const records = parse(readFile, { bom: true });
      return records;
    }
  } catch (err) {
    cronLog.error(`=======csvReader Error : File Not Found || Data File Empty :: ${err}=======`);
  }
}

const csvGenerator = async (sourceData) => {
  const Header = ["Merchant","State", "State Abbreviation", "Lat", "Lang"]
  const newData = [];
  for (let item of sourceData) {
    if (item[0] === "Merchant") {
      newData.push(Header)
    } else {
      const LatLang = await googleLatLangHandler(item.join())
      if (LatLang !== undefined) {
        let arrLatLang = Object.keys(LatLang).map((key) => LatLang[key])
        let rowContent = item.concat(arrLatLang)
        newData.push(rowContent)
      } else {
        let arrLatLang = ["undefined", "undefined"]
        let rowContent = item.concat(arrLatLang)
        newData.push(rowContent)
      }
    }
  }

  if (newData.length > 0) {
    const generateNewDataCsv = convertArrayToCSV(newData, {
      separator: ","
    });
    
    fs.writeFile("./data/generated.csv", generateNewDataCsv, err => {
      if (err) {
        cronLog.error(`=======csvGenerator Error : ${err}=======`);
      }
      cronLog.info(`======= Successfully Generated new CSV data=======`);
    })
  }
}