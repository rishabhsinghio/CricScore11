const axios = require('axios');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  
  res.write('<html><head><title>Node.js HTML</title></head><body>');
  res.write('<h1>Hello, Node.js!</h1>');
  res.write('</body></html>');

  res.end();
});

// Vercel uses the `listen` event for serverless functions
module.exports = server;

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

async function fetchData() {
  try {
    const response = await axios.request(options);

    if (Array.isArray(response.data)) {
      const firstLiveMatch = response.data.find(match => match.is_live === 'Live');

      if (firstLiveMatch) {
        // Extract relevant details
        const {
          match_type,
          match_number,
          match_location,
          team_details,
        } = firstLiveMatch;

        const teamOne = `${team_details[0].team_one_name}: ${team_details[0].team_one_score} / ${team_details[0].team_one_overs}`;
        const teamTwo = `${team_details[1].team_two_name}: ${team_details[1].team_two_score} / ${team_details[1].team_two_overs}`;

        // Format message
        const message = `${match_type}\n${match_number}\n${match_location}\n${teamOne}\n${teamTwo}`;

        const bot = new TelegramBot('6013292650:AAHFqOiI74zPrBsnf5PJTi7cQ2ZJC8riZcc', { polling: true });

        // Listen for incoming messages
        bot.on('message', (msg) => {
          const chatId = msg.chat.id;
          bot.sendMessage(chatId, message);

          // Reply to the sender
          setInterval(() => {
            bot.sendMessage(chatId, message);
          }, 60000);
        });

            } else {
              console.log('No live matches currently.');
            }
          } else {
            console.log('No match data available');
          }
        } catch (error) {
          console.error(error);
        }
      }
fetchData();
