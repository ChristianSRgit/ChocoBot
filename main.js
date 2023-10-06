const pc = require('picocolors');
//console.log(pc.color/bgcolor('hello cosmos'))
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const Product = require('./js/constructors/product');
const Venta = require('./js/constructors/venta');

const { getGoogleSheetsInstance } = require('./js/googleSheets');
const {ActualizarStockEnGoogleSheets,ActualizarPrecioEnGoogleSheets} = require('./js/updateStockAndPrice');

const {
    telegramStart,
    welcomeMessageHelp,
    ayuda,
    cant,
    blank,
    enviosData
} = require('./js/constants');




const botToken = process.env.botToken;

const bot = new TelegramBot(botToken, { polling: true });
const cvu = process.env.CVU;


const { google } = require('googleapis');

const app = express();

app.get("/", async (req, res) => {

    res.send('Bot Chocoloc0s')
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

app.listen(6969, (req, res) => console.log(pc.bgGreen(' running on http://localhost:6969')));
//deberia hacer aca la auth, get con template string `${variable}` para traer los valores que quiero de las hojas y despues exportarlos

// Manejar el primer mensaje del usuario para enviar el mensaje de bienvenida
bot.once('message', (msg) => {
    const chatId = msg.chat.id;

    // Mensaje de bienvenida
    const welcomeMessage = `¡Hola ${msg.from.first_name}!\n \n${welcomeMessageHelp}`;

    // Enviar el mensaje de bienvenida
    bot.sendMessage(chatId, welcomeMessage);
    console.log(pc.bgGreen('WELCOME MESSAGE SENT'));
});


let selectedProduct = null;

// Handle the /productos command to display available products
bot.onText(/\/productos/, async (msg) => {  // /start
    const chatId = msg.chat.id;

    // Obtener los datos de Google Sheets 
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
        range: "stock&price!A2:E6",
    });

    const productsSheetInfo = getRows.data.values;

    const buttonsRow = productsSheetInfo.map((product, index) => ({
        text: product[1], // Usar el primer valor (nombre del producto) como texto del botón
        callback_data: index, // Usar el segundo valor (ID del producto) como callback_data

    }));

    const keyboard = {
        inline_keyboard: [buttonsRow],

    }
    console.log(pc.bgBlack("SHOWING PRODUCTS"))


    // Enviar el mensaje con el teclado inline a los usuarios
    bot.sendMessage(chatId, telegramStart, {
        reply_markup: JSON.stringify(keyboard),

    });


    bot.on("callback_query", async query => {
        let chatId = query.message.chat.id;
        let productId = query.data; // ID del producto seleccionado

        // Buscar el producto seleccionado en los datos obtenidos de Google Sheets
        selectedProduct = productsSheetInfo.find((_, index) => index == productId);


        if (selectedProduct) {

            const productName = selectedProduct[1];
            const productPrice = selectedProduct[2];
            const productStock = selectedProduct[3];
            const productLink = selectedProduct[4];

            const product = new Product(productName, productPrice, productStock, productLink);

            let productDetails = `
             ${product.name}
            Precio: ${product.price}
            Mirá más en: ${product.link}
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

            setTimeout(
                function () {
                    bot.sendMessage(chatId, cant, {
                        reply_markup: JSON.stringify(quantityKeyboard),
                    });
                    console.log(pc.bgRed('SHOWING QUANTITY SELECTION'))
                }, 500);
        };

        // Manejar la selección de cantidad
        bot.on("callback_query", async query => {
            const chatId = query.message.chat.id;
            const callbackData = query.data; // Datos del callback
            let selectedProduct = productsSheetInfo.find((_, index) => index == productId);

            if (selectedProduct) {

                const productName = selectedProduct[1];
                const productPrice = parseFloat(selectedProduct[2].replace(".", ""));
                const productStock = parseFloat(selectedProduct[3].replace(".", ""));
                const productLink = selectedProduct[4];

                const product = new Product(productName, productPrice, productStock, productLink);

                if (callbackData.startsWith("quantity_")) {
                    const quantity = parseInt(callbackData.split("_")[1]); // Extraer la cantidad seleccionada

                    // Ahora puedes hacer lo que quieras con la cantidad seleccionada, como procesar el pedido, etc.
                    let calcPriceQuantity = product.price * quantity
                    // Por ejemplo, enviar un mensaje con la cantidad seleccionada
                    bot.sendMessage(chatId,
                        `Seleccionaste ${quantity} unidades.\n El total es de $${calcPriceQuantity} \n \n ${enviosData}`);
                    console.log(pc.bgMagenta('QUANTITY SELECTED: ' + quantity))

                    deliveryZone();

                }

            }
        });

        async function deliveryZone() {

            const ElegirZonaEnvio = {
                inline_keyboard: [
                    [
                        { text: 'CABA', callback_data: 'entrega_CABA' },
                        { text: 'Zona Norte', callback_data: 'entrega_ZonaNorte' }
                    ]
                ]
            };

            setTimeout(
                function () {
                    bot.sendMessage(chatId, "¿De que zona sos? 🏡", {
                        reply_markup: JSON.stringify(ElegirZonaEnvio)
                    });

                    console.log(pc.bgBlue('Eligiendo zona'))

                    // Manejar las respuestas a las opciones de envío
                    bot.on('callback_query', (query) => {
                        let entregaMensaje = '';
                        const chatId = query.message.chat.id;
                        const option = query.data;

                        if (option === 'entrega_CABA') {
                            entregaMensaje = 'Su pedido será entregado en CABA el día Viernes';
                        } else if (option === 'entrega_ZonaNorte') {
                            entregaMensaje = 'Su pedido será entregado en Zona Norte el día Sábado';
                        }

                        // Enviar el mensaje sobre la entrega estimada
                        bot.sendMessage(chatId, `${entregaMensaje}`);
                        console.log(pc.bgRed(`Eligieron ${option} `))

                        /*  if (option != null) {
                             PaymentMethod() -> create function to call it later
 
                         } */
                    });
                },
                500);
        }


    }) //selected products





}); //FIN productos




bot.onText(/\/stock/, async (msg) => {  // /start
    const chatId = msg.chat.id;
    console.log(pc.bgWhite('STOCK SECTION'))


    // Obtener los datos de Google Sheets 
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
        range: "stock&price!A2:E6",
    });

    const productsSheetInfo = getRows.data.values.map(product => {
        return new Product(product[1], product[2], product[3], product[4]);
    });
    const buttonsRow = productsSheetInfo.map((product, index) => ({
        text: product.name, // Usar el nombre del producto como texto del botón
        callback_data: `stock_${index}`, // Usar el índice del producto como callback_data con un prefijo "stock_"
    }));


    const keyboard = {
        inline_keyboard: [buttonsRow],
    };


    // Enviar el mensaje con el teclado inline de productos
    bot.sendMessage(chatId, 'Selecciona un producto para actualizar el stock:', {
        reply_markup: JSON.stringify(keyboard),
    });

    // Manejar la selección de un producto para actualizar el stock
    bot.on("callback_query", async query => {
        const chatId = query.message.chat.id;

        let productId = query.data.replace("stock_", ""); // Eliminar el prefijo "stock_"
        let selectedProduct = productsSheetInfo[productId]; // Obtener el producto seleccionado

         

          // Preguntar al usuario el nuevo valor de stock
        bot.sendMessage(chatId, `Escribe el nuevo stock para el producto seleccionado ${selectedProduct.name}:`);

        // Manejar la respuesta del usuario
        bot.onText(/^(\d+)$/, async (msg, match) => {
            const newStock = parseInt(match[1]); // Obtener el valor de stock ingresado por el usuario

        console.log(pc.bgBlue('Actualizando Stock'))
           

            ActualizarStockEnGoogleSheets(selectedProduct, newStock)

            bot.sendMessage(chatId, `Stock actualizado para el producto ${selectedProduct.name}: ${newStock}`);
        });

       

    })

    }) // fin /stock




    bot.onText(/\/ayuda/, async (msg) => {
        const chatId = msg.chat.id;
        console.log(pc.bgBlue('HELP MSSG SENT'))
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, `${ayuda}`);
    });


    bot.onText(/\/envios/, async (msg) => {
        const chatId = msg.chat.id;
        console.log(pc.bgBlue('DELI MSSG SENT'))
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, `${enviosData}`);
    });

