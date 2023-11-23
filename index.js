const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
const rapidAPI = require('rapidapi');

const cricketDataApiKey = '6f370459a0mshe5afcd3f5b0dab5p16b2a4jsn1d89511e7170';
const telegramBotToken = '6013292650:AAHFqOiI74zPrBsnf5PJTi7cQ2ZJC8riZcc';

const cricketDataApiUrl = `https://unofficial-cricbuzz.p.rapidapi.com/matches/get-scorecard`;
const telegramBot = new TelegramBot(telegramBotToken);

// Function to send greeting message
const sendGreetingMessage = (chatId) => {
  telegramBot.sendMessage(chatId, 'Welcome to the India Cricket Live Scores Bot!');
};

// Function to handle no match found
const handleNoMatchFound = (chatId) => {
  telegramBot.sendMessage(chatId, 'No live cricket matches found for India.');
};

// Function to handle match start
const handleMatchStart = (chatId, match) => {
  telegramBot.sendMessage(chatId, `🏏 Match started: ${match.title}`);
};

// Function to update score after 1 over
const updateScoreAfter1Over = (chatId, match) => {
  const score = `**Score:** ${match.score}`;
  telegramBot.sendMessage(chatId, score);
};

// Function to fetch and send live cricket scores
const fetchAndSendLiveScores = () => {
  const options = {
    uri: cricketDataApiUrl,
    headers: {
      'x-rapidapi-key': cricketDataApiKey,
      'x-rapidapi-host': 'unofficial-cricbuzz.p.rapidapi.com',
      useJson: true,
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }

    const matches = body.data;

    if (matches.length === 0) {
      handleNoMatchFound(chatId);
      return;
    }

    const indiaMatch = matches.find((match) => {
      return match.teams.some((team) => team.id === 'India');
    });

    if (!indiaMatch) {
      handleNoMatchFound(chatId);
      return;
    }

    if (indiaMatch.status === 'in progress') {
      updateScoreAfter1Over(chatId, indiaMatch);
      setInterval(() => updateScoreAfter1Over(chatId, indiaMatch), 60000); // Update score every minute
    } else if (indiaMatch.status === 'not started') {
      handleMatchStart(chatId, indiaMatch);
      setInterval(() => fetchAndSendLiveScores(), 60000); // Check again after a minute
    }
  });
};

// Start the bot and send greeting message
const chatId = '2119695649'; // Replace with your chat ID
sendGreetingMessage(chatId);
fetchAndSendLiveScores();
