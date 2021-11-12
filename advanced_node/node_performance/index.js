
const express = require('express');
const app = express();
const {Worker} = require('worker_threads')

app.get('/', (req, res) => {
  const worker = new Worker(function () {
    this.onmessage = function () {
      let counter = 0

      while(counter < 1e9) {
        counter++
      }
      postMessage(counter);
    }
  })

  worker.onmessage = function(myCounter) {
    console.log(myCounter)
  }

  worker.postMessage();
});

app.get('/fast', (req, res) => {
  res.send('This was fast!');
});

app.listen(3000);


