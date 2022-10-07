'use strict';

class Queue{
  constructor(){
    this.data = {};
  }

  add(key, value){
    this.data[key] = value;
    return key;
  }

  read(key){
    return this.data[key];
  }

  remove(key){
    console.log('deleted message');
    let value = this.data[key];
    delete this.data[key];
    return value;
  }
}

module.exports = Queue;