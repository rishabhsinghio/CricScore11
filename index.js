const request = require('request');
const TelegramBot = require('node-telegram-bot-api');

const cricketDataApiKey = 'b1455909-c491-4cc5-b6f2-e04330d33810';
const telegramBotToken = '6013292650:AAHFqOiI74zPrBsnf5PJTi7cQ2ZJC8riZcc';
const chatId = '2119695649';

const cricketDataApiUrl = `https://api.cricketdata.org/v1/matches?apiKey=${cricketDataApiKey}`;
const telegramBot = new TelegramBot(telegramBotToken);

const sendMatchDetailsToTelegram = (match) => {
  if (match.teams.length === 2 && match.teams.some(team => team.id === 'India')) {
    const matchDetails = `
      Match: ${match.title}
      Teams: ${match.teams.join(', ')}
      Status: ${match.status}
      Score: ${match.score}
    `;

    telegramBot.sendMessage(chatId, matchDetails);
  }
};

const handleError = (error) => {
  console.error(error);
  telegramBot.sendMessage(chatId, `An error occurred while fetching live match details: ${error.message}`);
};

setInterval(() => {
  request(cricketDataApiUrl, (error, response, body) => {
    if (error) {
      handleError(error);
      return;
    }

    const matches = JSON.parse(body).data;

    if (matches.length > 0) {
      telegramBot.sendMessage(chatId, `Fetched live match details:`);
      matches.forEach(sendMatchDetailsToTelegram);
    } else {
      telegramBot.sendMessage(chatId, `No live matches found`);
    }
  });
}, 60000);
