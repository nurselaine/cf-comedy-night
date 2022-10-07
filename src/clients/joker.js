'use strict';

const MessageClient = require('./lib/Client');
const joker = new MessageClient('Joker');

const Chance = require('chance');
const chance = new Chance();

joker.publish('GET_ALL', {queueID: 'Joker'});

joker.subscribe('GETSHOW', () => {
  let payload = {
    jokeID: chance.guid(),
    joke: 'Why do programmers prefer dark mode....?',
    punchline: 'Because bugs are attracted to the light!',
  };
  console.log(`Okay, here's a good one. ${payload.joke}`);
  setTimeout(() => {
    console.log(`${payload.punchline}`);
  }, 1000);
  joker.publish('JOKE', payload);
});

joker.subscribe('LAUGH', (payload) => {
  console.log('Thank you! Thank you!');
  joker.publish('RECEIVED', payload);
});
