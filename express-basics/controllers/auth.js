const crypto = require('crypto');

require('dotenv').config()
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const {
  validationResult
} = require('express-validator/check');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.EMAIL_API
  }
}));

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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg
    });
  }

  bcrypt.hash(password, 12)
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
    .then(() => {
      res.redirect('/');
      return transporter.sendMail({
        to: email,
        from: 'kevin.m.guertin@gmail.com',
        subject: 'Signup Succeded',
        html: '<h1>You Successfully Signed Up!</h1>'
      })
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}

exports.getReset = (req, res) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0]
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (!user) {
          req.flash('error', 'No Account With That Email Found');
          res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'kguertin90@gmail.com',
          subject: 'Password Reset',
          html: `
            <p>You requested a password reset.</p>\
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        })
      })
      .catch(err => console.log(err));
  })
}

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    })
    .then(user => {
      let message = req.flash('error');

      if (message.length > 0) {
        message = message[0]
      } else {
        message = null;
      }

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => console.log(err));
}

exports.postNewPassword = (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: {
        $gt: Date.now()
      },
      _id: userId
    })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save()
    })
    .then(() => res.redirect('/login'))
    .catch(err => console.log(err));

}