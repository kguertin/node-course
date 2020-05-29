const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5ed17e8b0418670616aeb06e')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://kevin:node1234@cluster0-kmmuu.mongodb.net/shop?retryWrites=true&w=majority')
  .then(() => {
    User.findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'Kevin',
            email: 'test@test.com',
            cart: {
              items: []
            }
          })
          user.save()
        }
      })
    app.listen(3000)
  })
  .catch(err => console.log(err));