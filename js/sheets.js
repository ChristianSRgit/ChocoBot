const {google} = require('googleapis');
require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
// https://www.npmjs.com/package/google-spreadsheet
const express = require('express');
const app = express();


// import google sheets id
const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;



app.get("/", async (req, res) => {
    
    const auth = new google.auth.GoogleAuth({
        keyFile: "secret.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //create client instance for auth
    const client = await auth.getClient();

//instance of google sheets API

const googleSheets = google.sheets({ version: "v4", auth: client});

const spreadsheetId  = process.env.GOOGLE_SHEETS_ID;


const meta = await googleSheets.spreadsheets.get({

    auth,
    spreadsheetId,

})

res.send(meta.data)

});

// read rows from spreadsheet












app.listen(6969, (req, res) => console.log(' running on http://localhost:6969'));
//deberia hacer aca la auth, get con template string `${variable}` para traer los valores que quiero de las hojas y despues exportarlos




