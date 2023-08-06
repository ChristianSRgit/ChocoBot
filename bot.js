const pc = require('picocolors');
//console.log(pc.color/bgcolor('hello cosmos'))
const emoji = require('node-emoji');
/* emojilib: provides a list of emojis and keyword search on top of it
skin-tone: parses out base emojis from skin tones */

const {
  telegramStart,
  welcomeMessageHelp,
  ayuda,
  blank
  } = require('./constants');

  const {
    products
  } = require('./products');

const TelegramBot = require('node-telegram-bot-api');
/* const { GoogleSpreadsheet } = require('google-spreadsheet'); */

require('dotenv').config();
const botToken  = process.env.botToken;
/* const googleSheetId = process.env.GOOGLE_SHEETS_ID; */

// import google sheets
/* const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;

const doc = new GoogleSpreadsheet(googleSheetId); */



const bot = new TelegramBot(botToken, { polling: true });

// Manejar el primer mensaje del usuario para enviar el mensaje de bienvenida
bot.once('message', (msg) => {
  const chatId = msg.chat.id;

  // Mensaje de bienvenida
  const welcomeMessage = `¡Hola ${msg.from.first_name}!\n \n${welcomeMessageHelp}`;
  
  // Enviar el mensaje de bienvenida
  bot.sendMessage(chatId, welcomeMessage);
  console.log(pc.bgGreen('WELCOME MESSAGE SENT'));
});



// Handle the /start command to display available products
bot.onText(/\/start/, async (msg) => {  // /start
  const chatId = msg.chat.id;
  

  const buttonsRow = [];

  products.forEach((product) => {
    const button = {
      text: `${product.name} `,
      callback_data: product.id.toString(),
    };
    buttonsRow.push(button);
  });


  // Create a Telegram inline keyboard with product buttons
  const keyboard = {
    inline_keyboard: [buttonsRow]

  }

  // Send the message with the inline keyboard to the user
  bot.sendMessage(chatId,telegramStart, {
    reply_markup: JSON.stringify(keyboard),
  });
  console.log(pc.bgGreen('SHOWING PRODUCTS'))
});




bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
console.log(pc.bgBlue('HELP MSSG SENT'))
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, `${ayuda}`);
});