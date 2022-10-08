'use strict';

const MessageClient = require('./lib/Client');
const joker = new MessageClient('Joker');
const axios = require('axios');

const Chance = require('chance');
const chance = new Chance();


joker.publish('GET_ALL', {queueId: 'Joker'});

joker.subscribe('GETSHOW', async () => {
  let joke;
  try {
    joke = await axios.get('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,racist,sexist&type=twopart');
  } catch(e) {
    console.log(`Error: ${e}`);
  }
  let payload = {
    messageId: chance.guid(),
    queueId: 'Audience',
    joke: joke.data.setup,
    punchline: joke.data.delivery,
  };
  console.log(`Okay, here's a good one. ${payload.joke}`);
  setTimeout(() => {
    console.log(`${payload.punchline}`);
  }, 1000);
  joker.publish('JOKE', payload);

});
