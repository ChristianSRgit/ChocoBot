const { google } = require('googleapis');
const { googleAuthScopes, googleSheetsVersion } = require('./config'); // Ajusta las importaciones según tu estructura
require('dotenv').config();

// Función para obtener una instancia de Google Sheets
async function getGoogleSheetsInstance() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "secret.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //create client instance for auth
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version:"v4", auth: client });
    return googleSheets;
}

module.exports = {
    getGoogleSheetsInstance,
};
