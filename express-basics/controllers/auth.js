const User = require('../models/user');

exports.getLogin = (req, res) => {
  //   const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';
  console.log(req.session.isLoggedIn)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  })
}

exports.postLogin = (req, res) => {
  User.findById('5ed17e8b0418670616aeb06e')
    .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      res.redirect('/');
    })
    .catch(err => console.log(err));
}