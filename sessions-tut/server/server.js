const express = require('express');
const {v4: uuidv4 }= require('uuid');
const session = require('express-session');

const app = express();

app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuidv4();
  },
  secret:'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.get('/', (req, res) => {
  console.log('Inside the homepage callback function');
  console.log(req.sessionID);
  res.end('You Hit The Home Page!\n');
})

app.listen(3000, () => console.log('Now Listening on Port 3000'));