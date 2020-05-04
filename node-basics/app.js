// Node server w/o Express

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req);
});

server.listen(3000)
