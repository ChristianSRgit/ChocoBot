// index.js
const TelegramBot = require('node-telegram-bot-api');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const googleSheetCredentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
const googleSheetId = process.env.GOOGLE_SHEETS_ID;

const bot = new TelegramBot(botToken, { polling: true });
const doc = new GoogleSpreadsheet(googleSheetId);



// Handle the /start command to display available products
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const products = await getProducts();

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
});
