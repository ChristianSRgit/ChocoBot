const {google} = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');
// https://www.npmjs.com/package/google-spreadsheet

require('dotenv').config();


//deberia hacer aca la auth, get con template string `${variable}` para traer los valores que quiero de las hojas y despues exportarlos

const googleSheetId = process.env.GOOGLE_SHEETS_ID;

// import google sheets
const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;


const doc = new GoogleSpreadsheet(googleSheetId,credentials);

console.log(doc);
