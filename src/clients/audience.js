'use strict';

const MessageClient = require('./lib/Client');
const audience = new MessageClient('Audience');

audience.publish('GET_ALL', {queueID: 'Audience'});

setInterval(() => {
  audience.publish('GETSHOW', () => {
    console.log('Tell us a joke!');
  });
}, 5000);

audience.subscribe('JOKE', (payload) => {
  console.log('HAHAHAHA');
  audience.publish('LAUGH', payload);
});

audience.subscribe('RECEIVED', (payload) => {
  console.log(`Joke ${payload.jokeID} was hilarious!`);
});

