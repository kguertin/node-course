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

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  })
}

exports.postLogin = (req, res) => {
  User.findById('5ed17e8b0418670616aeb06e')
    .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
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
        return res.redirect('/signup');
      }
      const user = new User({
        email,
        password,
        cart: {
          items: []
        }
      });
      return user.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}