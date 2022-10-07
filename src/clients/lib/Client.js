'use strict';

const { io } = require('socket.io-client');
const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:3002/jokes';

class MessageClient {
  constructor(queueID) {
    this.queueID = queueID;
    this.socket = io(SOCKET_URL);
    this.socket.emit('JOIN', queueID);
    this.socket.on('JOIN', (id) => {
      console.log('New Client Joined the Queue');
    });
  }

  publish(event, payload) {
    this.socket.emit(event, {...payload, queueID: this.queueID});
  }

  subscribe(event, callback) {
    this.socket.on(event, callback);
  }
}

module.exports = MessageClient;
