const {google} = require('googleapis');
const sheets = google.sheets('v4');
require('dotenv').config();

async function main () {
    const authClient = await authorize();
    const request = {
      // The spreadsheet to apply the updates to.
      spreadsheetId: `${process.env.GOOGLE_SHEETS_ID}`,  // TODO: Update placeholder value.
  
      resource: {
        // A list of updates to apply to the spreadsheet.
        // Requests will be applied in the order they are specified.
        // If any request is not valid, no requests will be applied.
        requests: [],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
  
      auth: authClient,
    };
  
    try {
      const response = (await sheets.spreadsheets.batchUpdate(request)).data;
      // TODO: Change code below to process the `response` object:
      console.log(JSON.stringify(response, null, 2));
    } catch (err) {
      console.error(err);
    }
  }
  main();
  
  async function authorize() {
   
    //   'https://www.googleapis.com/auth/spreadsheets
    let authClient = null;
  
    if (authClient == null) {
      throw Error('authentication failed');
    }
  
    return authClient;
  }