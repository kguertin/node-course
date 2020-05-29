const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const errorController = require('./controllers/error');
// const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('5ecda678612453e0013669b9')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id); // Otherwise doesnt have access to methods on user model 
//       next();
//     })
//     .catch(err => console.log(err))
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://kevin:node1234@cluster0-kmmuu.mongodb.net/shop?retryWrites=true&w=majority')
  .then(() => app.listen(3000))
  .catch(err => console.log(err));