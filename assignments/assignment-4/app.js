const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

const users = [];

app.get('/users', (req, res) => {
  console.log(users)
  res.render('users', { pageTitle: 'Users', users: users })
})

app.post('/users', (req, res) => {
  users.push({ userName: req.body.user })
  console.log(users)
  res.render('users', { pageTitle: 'Users', users: users })
})

app.get('/', (req, res) => {
  res.render('home', { pageTitle: 'Home' })
})


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}...`);
})