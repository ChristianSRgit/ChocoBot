const pc = require('picocolors');
//console.log(pc.color/bgcolor('hello cosmos'))
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');


const {
    telegramStart,
    welcomeMessageHelp,
    ayuda,
    cant,
    blank,
} = require('./js/constants');

const {
    products
} = require('./js/products');


const botToken = process.env.botToken;

const bot = new TelegramBot(botToken, { polling: true });


const { google } = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');
// https://www.npmjs.com/package/google-spreadsheet

const app = express();

app.get("/", async (req, res) => {

    res.send('xd')
    console.log(pc.bgCyan('        WORKS        '))

});

app.get("/write", async (req, res) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: "secret.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //create client instance for auth
    const client = await auth.getClient();

    //instance of google sheets API

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;



    //write row(s) to spreadsheet

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "pagos!A:D",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                //client, ticket Nro, 
                ["make a payment", "date of that payment", "123", "18/09/1995"]
            ]
        }
    })


});

app.listen(6969, (req, res) => console.log(' running on http://localhost:6969'));
//deberia hacer aca la auth, get con template string `${variable}` para traer los valores que quiero de las hojas y despues exportarlos

// Manejar el primer mensaje del usuario para enviar el mensaje de bienvenida
bot.once('message', (msg) => {
    const chatId = msg.chat.id;

    //guardo num
    const phoneNumber = msg.contact ? msg.contact.phone_number : msg.from?.contact?.phone_number;



    // Mensaje de bienvenida
    const welcomeMessage = `¡Hola ${msg.from.first_name}!\n \n${welcomeMessageHelp}`;

    // Enviar el mensaje de bienvenida
    bot.sendMessage(chatId, welcomeMessage);
    console.log(pc.bgGreen('WELCOME MESSAGE SENT'));
    console.log(pc.bgYellow(phoneNumber))
});



// Handle the /start command to display available products
bot.onText(/\/productos/, async (msg) => {  // /start
    const chatId = msg.chat.id;

    // Obtener los datos de Google Sheets y generar los botones
    const auth = new google.auth.GoogleAuth({
        keyFile: "secret.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "stock&price!A2:D6",
    });

    const productsSheetInfo = getRows.data.values;

    const buttonsRow = productsSheetInfo.map(product => ({
        text: product[0], // Usar el primer valor (nombre del producto) como texto del botón
        callback_data: product[1], // Usar el segundo valor (ID del producto) como callback_data
    }));

    const keyboard = {
        inline_keyboard: [buttonsRow],
    }

    // Enviar el mensaje con el teclado inline a los usuarios
    bot.sendMessage(chatId, telegramStart, {
        reply_markup: JSON.stringify(keyboard),
    });

    // ...

    bot.on("callback_query", async query => {
        const chatId = query.message.chat.id;
        const productId = query.data; // ID del producto seleccionado

        // Buscar el producto seleccionado en los datos obtenidos de Google Sheets
        const selectedProduct = productsSheetInfo.find(product => product[1] === productId);

        if (selectedProduct) {
            const productDetails = `
             ${selectedProduct[0]}
            Precio: ${selectedProduct[1]}
            Mirá más en: ${selectedProduct[3]}
         `;

            // Enviar los detalles del producto como mensaje al chat
            bot.sendMessage(chatId, productDetails);
            console.log(pc.bgWhite('SHOWING DETAILS'));



            // Enviar la cantidad de productos para seleccionar
            const quantityKeyboard = {
                inline_keyboard: [
                    // Crear una fila de botones del 1 al 5
                    Array.from({ length: 5 }, (_, index) => ({
                        text: (index + 1).toString(),
                        callback_data: `quantity_${index + 1}`,
                    })),
                    // Crear otra fila de botones del 6 al 10
                    Array.from({ length: 5 }, (_, index) => ({
                        text: (index + 6).toString(),
                        callback_data: `quantity_${index + 6}`,
                    })),
                ],
            }

            bot.sendMessage(chatId, cant, {
                reply_markup: JSON.stringify(quantityKeyboard),
            });

        };
        console.log(pc.bgRed('SHOWING QUANTITY SELECTION'))
    })
});

// Manejar la selección de cantidad
bot.on("callback_query", async query => {
    const chatId = query.message.chat.id;
    const callbackData = query.data; // Datos del callback

    if (callbackData.startsWith("quantity_")) {
        const quantity = parseInt(callbackData.split("_")[1]); // Extraer la cantidad seleccionada

        // Ahora puedes hacer lo que quieras con la cantidad seleccionada, como procesar el pedido, etc.
        // Por ejemplo, enviar un mensaje con la cantidad seleccionada
        bot.sendMessage(chatId, `Seleccionaste ${quantity} unidades.`);
        console.log(pc.bgMagenta('QUANTITY SELECTED: ' + quantity))
    }
});


bot.onText(/\/ayuda/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(pc.bgBlue('HELP MSSG SENT'))
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, `${ayuda}`);
});


