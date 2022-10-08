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

    console.log(`SERVER: get show ${JSON.stringify(payload)}`);
    let audienceQueue = messageQueue.read(payload.payload.queueId);
    if(!audienceQueue){
      let queueKey = messageQueue.store(payload.payload.queueId, new Queue());
      audienceQueue = messageQueue.read(queueKey);
    }
    console.log('message queue added audienceq :::::::::::::::::::', messageQueue);

    audienceQueue.store(payload.messageId, payload);
    console.log('audience queue added :::::::::::::::::::', audienceQueue);
    jokes.emit('GETSHOW', payload);
  });

  socket.on('JOKE', payload => {
    eventLogger(payload, 'joke');
    console.log('PAYLOAD:::::::::::::', payload);
    let jokerQueue = messageQueue.read(payload.queueId);
    if(!jokerQueue){
      let queueKey = messageQueue.store(payload.queueId, new Queue());
      jokerQueue = messageQueue.read(queueKey);
    }
    console.log('audience queue added :::::::::::::::::::', messageQueue);

    jokerQueue.store(payload.messageId, payload);
    jokes.emit('JOKE', payload);
  });

  // socket.on('LAUGH', payload => {
  //   eventLogger(payload, 'laugh');
  //   let jokerQueue = messageQueue.read(payload.payload.queueId);
  //   if(!jokerQueue){
  //     throw new Error('Joker Queue does not exist');
  //   }

  //   jokerQueue.store(payload.messageId, payload);
  //   jokes.emit('LAUGH', payload);
  // });

  socket.on('RECEIVED', payload => {
    eventLogger(payload, 'received');
    console.log('RECEIVED LOG::::::::', payload);
    let currentQueue = messageQueue.read(payload.queueId);

    if(!currentQueue){
      throw new Error('Queue does not exist');
    }

    let message = currentQueue.remove(payload.messageId);
    console.log('MESSAGE', message);
    jokes.emit('RECEIVED', message);
  });

  socket.on('GET_ALL', payload => {
    console.log('get all server function', payload);
    let currentQueue = messageQueue.read(payload.queueId);
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
