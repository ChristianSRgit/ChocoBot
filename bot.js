const pc = require('picocolors');


const TelegramBot = require('node-telegram-bot-api');
const { GoogleSpreadsheet } = require('google-spreadsheet');

require('dotenv').config();
const botToken  = process.env.botToken;



const bot = new TelegramBot(botToken, { polling: true });


// import google sheets
/* const googleSheetCredentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
const googleSheetId = process.env.GOOGLE_SHEETS_ID;

const doc = new GoogleSpreadsheet(googleSheetId); */

// Matches "/echo [whatever]" 




// Handle the /start command to display available products
bot.onText(/\/start/, async (msg) => {  // /start
  const chatId = msg.chat.id;
  const products = [
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

  // Create a Telegram inline keyboard with product buttons
  const keyboard = {
    inline_keyboard: products.map((product) => {
      return [
        {
          text: `${product.name} - $${product.price}`,
          callback_data: product.id.toString(), // Assuming there's an "id" column in the sheet
        },
      ];
    }),
  };

  // Send the message with the inline keyboard to the user
  bot.sendMessage(chatId, 'Welcome to our store! Please choose a product:', {
    reply_markup: JSON.stringify(keyboard),
  });
  console.log(pc.bgGreen('SHOWING PRODUCTS'))
});

// Handle button clicks to show product details