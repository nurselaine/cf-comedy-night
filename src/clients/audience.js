'use strict';

const Chance = require('chance');
const chance = new Chance();

const MessageClient = require('./lib/Client');
const audience = new MessageClient('Audience');

audience.publish('GET_ALL', {queueID: 'Audience'});

setInterval(() => {
  const payload = {
    queueId: 'Audience',
    message: 'Tell us a joke!',
  };

  console.log('Tell us a joke!');
  audience.publish('GETSHOW', { messageId: chance.guid(), payload });
}, 5000);

audience.subscribe('JOKE', (payload) => {
  console.log('HAHAHAHA');
  // audience.publish('LAUGH', payload);
  audience.publish('RECEIVED', payload);
});

audience.subscribe('RECEIVED', (payload) => {
  console.log(`Joke ${payload.jokeID} was hilarious!`);
});

