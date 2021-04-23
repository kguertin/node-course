const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ) {
    return res.json({
      success: false,
      msg: 'Please select captcha',
    });
  }

  const secretKey = '6Lc5GX0aAAAAAMyi4U3pNKNX_O4Dr-TCJQ0Un76M';
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  axios(verifyUrl)
    .then((res) => console.log(res))
    .catch();
});

app.listen(3000, () => console.log('server started on port 3000'));
