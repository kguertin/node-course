const express = require('express');
const {
  v4: uuidv4
} = require('uuid');
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const users = [{
  id: '2f24vvg',
  email: 'test@test.com',
  password: 'password'
}]

// Configure passport.js to user local strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  (email, password, done) => {
    console.log('Inside Local Strategy callback');
    //Here we would make a call to our database to check user email and password

    const user = users[0];
    console.log(email, ' === ', user.email);
    console.log(password, ' === ', user.password);
    if (email === user.email && password === user.password) {
      console.log('Local strategy returned true.');
      return done(null, user);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log('Inside Serialization callback. User id is save to the session file here');
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  console.log("Inside deserializeUser Callback");
  console.log(`The user id passport saved in the session file store is: ${id}`);
  const user = users[0].id === id ? users[0] : false;
  done(null, user);
})

const app = express();

app.use(bodyParser({
  urlencoded: false
}));
app.use(bodyParser.json());

app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log('Request Object sessionID in clieht:', req.sessionID)
    return uuidv4();
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session())

app.get('/', (req, res) => {
  console.log('Inside the homepage callback function');
  console.log(req.sessionID);
  res.end('You Hit The Home Page!\n');
})

app.get('/login', (req, res) => {
  console.log('Inside GET /login callback function');
  console.log(res.sessionID);
  res.send('You got the login page!\n');
})

app.post('/login', (req, res, next) => {
  console.log('Inside POST /login callback function');
  passport.authenticate('local', (err, user, info) => {
    console.log('inside passport.authenticate() callback');
    console.log(`req.sessions.passport: ${JSON.stringify(req.session.passport)}`);
    console.log(`req.user: ${JSON.stringify(req.user)}`);
    req.login(user, (err) => {
      console.log('inside the req.login() callback');
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      return res.send('You are authenticated and logged in');
    })
  })(req, res, next);
})

app.get('/authrequired', (req, res) => {
  console.log('Inside GET /authrequired callback');
  console.log(`User Authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n');
  } else {
    res.redirect('/');
  }
});


app.listen(3000, () => console.log('Now Listening on Port 3000'));