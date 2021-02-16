const path = require('path');

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const Image = require('./models/Image');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on('error', console.log);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const id = uuid();
    const filePath = `images/${id}${ext}`;
    Image.create({ filePath }).then(() => {
      cb(null, filePath);
    });
  },
});
const upload = multer({ storage });

const app = express();
app.use(express.static('public'));
app.use(express.static('uploads'));

app.post('/upload', upload.array('avatar'), (req, res) => {
  return res.json({ status: 'ok', uploaded: req.files.length });
});

app.get('/images', (req, res) => {
  Image.find().then((images) => {
    return res.json({ status: 'OK', images });
  });
});

app.listen(3001, () => console.log('App is listening...'));
