const express = require('express');
const app = express();

const PORT = 3000;

// app.use('/', (req, res, next) => {
//   console.log('First middlewear that runs on all routes.');
//   next();
// });

// app.use('/', (req, res) => {
//   console.log('Second middlewear that runs on all routes');
//   res.send('<h1>Toronto Raptors NBA Champions</h1>');
// })

app.use('/users', (req, res) => {
  res.send('<ul><li>PG: Kyle Lowry</li><li>Fred VanVleet</li><li>Pascal Siakiam</li><li>OG Anunoby</li><li>Marc Gasol</li></ul>');
});

app.use('/', (req, res) => {
  res.send('<h1>Toronto Raptors 2020 NBA Champions</h1>')
})


app.listen(PORT, () => {
  console.log(`Server active on ${PORT}...`)
});