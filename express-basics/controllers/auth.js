const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0]
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  })
}

exports.getSignup = (req, res) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0]
  } else {
    message = null;
  }
  
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  })
}

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
      email: email
    })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid Email or Password');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            })
          }
          req.flash('error', 'Invalid Email or Password');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        })
    })
    .catch(err => console.log(err));
}

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({
      email: email
    })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email Exists Already. Please use a Different One.');
        return res.redirect('/signup');
      }

      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: {
              items: []
            }
          });
          return user.save()
        })
        .then(() => res.redirect('/'))
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}