const path = require('path')

const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/purple', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'test2.html'))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'test1.html'))
})


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})