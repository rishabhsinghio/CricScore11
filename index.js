const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const botToken = '6013292650:AAHFqOiI74zPrBsnf5PJTi7cQ2ZJC8riZcc';
const bot = new TelegramBot(botToken, { polling: true });
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public'))); // Assumes index.html in "public" folder

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/main.html')); // Directly sends index.html
});

app.listen(3000, () => console.log('Server listening on port 3000'));
const fetchDataAndUpdateMessage = async (chatId, messageId) => {
  const options = {
    method: 'POST',
    url: 'https://free-cricket-live-score.p.rapidapi.com/',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '6f370459a0mshe5afcd3f5b0dab5p16b2a4jsn1d89511e7170',
      'X-RapidAPI-Host': 'free-cricket-live-score.p.rapidapi.com',
    },
    data: { key: 'ignor' },
  };

  try {
    const response = await axios.request(options);
    const matchesWithIND = response.data.filter(match => match.match_type.includes('IND'));

    // Check if any match details have a null or undefined result
    const matchesWithoutResult = matchesWithIND.filter(match => !match.result);

    // Update the existing message or send a new one
    if (matchesWithoutResult.length > 0) {
      const updateMessages = matchesWithoutResult.map(match => {
        return `
          ${match.match_type}
${match.match_number}
${match.match_location} \n 
${match.team_details[0].team_one_name}: ${match.team_details[0].team_one_score} in ${match.team_details[0].team_one_overs} overs 
${match.team_details[1].team_two_name}: ${match.team_details[1].team_two_score} in ${match.team_details[1].team_two_overs} overs \n
Result: ${match.result || 'Not Declared'}
          
        `;
      });

      const message = updateMessages.join('\n\n');

      // Update the message every minute
      // Update the message every minute
      bot.editMessageText(message, { chat_id: chatId, message_id: messageId});
        setInterval(() => fetchDataAndUpdateMessage(chatId, messageId), 300000); // 5 minute interval

    }
  } catch (error) {
    console.error(error);
  }
};

// Listen for incoming messages
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Thank You for choosing this bot. Now you will never miss any match updates of India. \nFetching match details...').then((response) => {
    // Save the message ID for updating later
    const messageId = response.message_id;

    // Call the function with the chat ID and message ID
    fetchDataAndUpdateMessage(chatId, messageId);
  });
});

let timer = setInterval(function() {
  console.log("This will be printed every second");
}, 1000) // interval time set here in miliseconds