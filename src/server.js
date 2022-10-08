'use strict';

const { Server } = require('socket.io');
const Queue = require('./lib/Queue');

const PORT = process.env.PORT || 3002;
const server = new Server(PORT);
const messageQueue = new Queue();

const jokes = server.of('/jokes');

jokes.on('connection', (socket) => {

  socket.on('JOIN', (queueId) => {
    console.log(`You've joined the ${queueId} room!`);

    socket.join(queueId);
  });

  socket.on('GETSHOW', (payload) => {
    eventLogger(payload, 'get show');
    let jokerQueue = messageQueue.read(payload.queueId);
    if(!jokerQueue){
      let queueKey = messageQueue.store(payload.queueId, new Queue());
      jokerQueue = messageQueue.read(queueKey);
    }

    jokerQueue.store(payload.messageId, payload);
    jokes.emit('GETSHOW', payload);
  });

  socket.on('JOKE', payload => {
    eventLogger(payload, 'joke');
    let audienceQueue = messageQueue.read(payload.queueId);
    if(!audienceQueue){
      let queueKey = messageQueue.store(payload.queueId, new Queue());
      audienceQueue = messageQueue.read(queueKey);
    }

    audienceQueue.store(payload.messageId, payload);
    jokes.emit('JOKE', payload);
  });

  socket.on('LAUGH', payload => {
    eventLogger(payload, 'laugh');
    let jokerQueue = messageQueue.read(payload.queueId);
    if(!jokerQueue){
      throw new Error('Joker Queue does not exist');
    }

    jokerQueue.store(payload.messageId, payload);
    jokes.emit('LAUGH', payload);
  });

  socket.on('RECEIVED', payload => {
    eventLogger(payload, 'received');
    let currentQueue = messageQueue.read(payload.queueId);

    if(!currentQueue){
      throw new Error('Queue does not exist');
    }

    let message = currentQueue.remove(payload.messageId);
    jokes.to(payload.queueId).emit('RECEIVED', message);
  });

  socket.on('GET_ALL', payload => {
    console.log('get all server function', payload);
    let currentQueue = messageQueue.read(payload.queueID);
    if(currentQueue && currentQueue.data){
      Object.keys(currentQueue.data).forEach(messageId => {
        jokes.emit('LAUGH', currentQueue.read(messageId));
      });
    }
  });

});

function eventLogger(payload, event){
  const body = {
    EVENT: event,
    payload,
  };
  console.log(body);
}
