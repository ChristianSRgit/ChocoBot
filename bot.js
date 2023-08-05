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


const TelegramBot = require('node-telegram-bot-api');
const { GoogleSpreadsheet } = require('google-spreadsheet');

require('dotenv').config();
const botToken  = process.env.botToken;

console.log(


)
const bot = new TelegramBot(botToken, { polling: true });


// import google sheets
/* const googleSheetCredentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
const googleSheetId = process.env.GOOGLE_SHEETS_ID;

const doc = new GoogleSpreadsheet(googleSheetId); */


// Manejar el primer mensaje del usuario para enviar el mensaje de bienvenida
bot.once('message', (msg) => {
  const chatId = msg.chat.id;

  // Mensaje de bienvenida
  const welcomeMessage = `¡Hola ${msg.from.first_name}!\n \n${welcomeMessageHelp}`;
  
  // Enviar el mensaje de bienvenida
  bot.sendMessage(chatId, welcomeMessage);
  console.log(pc.bgGreen('MENSAJE DE BIENVENIDA ENVIADO'));
});



let products = [
  {
    id:0,
    name:'producto1',
    price:'precio1',
    stock:'stock1'
  },
  {
    id:1,
    name:'producto2',
    price:'precio2',
    stock:'stock2'
  },
  {
    id:2,
    name:'producto3',
    price:'precio3',
    stock:'stock3'
  },
  {
    id:3,
    name:'producto4',
    price:'precio4',
    stock:'stock4'
  },
  {
    id:4,
    name:'producto5',
    price:'precio5',
    stock:'stock5'
  }
];

// Handle the /start command to display available products
bot.onText(/\/start/, async (msg) => {  // /start
  const chatId = msg.chat.id;
  

  const buttonsRow = [];

  products.forEach((product) => {
    const button = {
      text: `${product.name} ${product.price}`,
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




bot.on(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, `${ayuda}`);
});