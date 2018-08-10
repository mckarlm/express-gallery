// LIBRARIES
const express = require('express');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const Redis = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');

// OTHER FILES
const User = require('./db/models/User');
const routes = require('./routes');
const index = require('./routes/index')
const auth = require('./extra/auth');

const saltRounds = 12;
const server = express();
const PORT = process.env.PORT || 4020;

server.use(express.static('./public'));

// BODY-PARSER
server.use(bodyparser.urlencoded({ extended: true }));
server.use(bodyparser.json());

// SESSION + REDIS SET-UP
server.use(session({
  store: new Redis(),
  secret: 'down the rabbit hole',
  resave: false,
  saveUninitialized: true
}));

// METHOD OVERRIDE
server.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  };
}));

// HANDLEBARS
server.engine('.hbs', handlebars({
  defaultLayout: 'index',
  extname: '.hbs'
}));
server.set('view engine', '.hbs');

server.use('/', routes);
server.use('/index', index)
// server.use('/auth', auth)

// PASSPORT
server.use(passport.initialize());
server.use(passport.session());

// Fires on successful login
passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

// Fires on every request following serialization
passport.deserializeUser((user, done) => {
  console.log('deserializing');
  new User({ id: user.id })
    .fetch()
    .then(user => {
      user = user.toJSON();
      console.log(user)
      return done(null, {
        id: user.id,
        username: user.username
      });
    })
    .catch(err => {
      console.log(err);
      return done(err);
    });
});


passport.use(new LocalStrategy(function (username, password, done) {
  return new User({ username: username })
    .fetch()
    .then(user => {
      user = user.toJSON();
      console.log(user);
      if (user === null) {
        return done(null, false, { message: 'Wrong Username and/or Password' });
      } else {
        console.log(password, user.password);
        bcrypt.compare(password, user.password)
          .then(samePassword => {
            if (samePassword) {
              console.log(samePassword);
              return done(null, user);
            } else {
              return done(null, false, { message: 'Wrong Username and/or Password' });
            };
          });
      };
    })
    .catch(err => {
      console.log('error: ', err);
      return done(err);
    });
}));

// LOGIN/LOGOUT STUFF
server.get('/login', (req, res)=>{
    res.render('pages/getLogin');
  })
  
server.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/'
}));

server.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

server.get('/login/forgotpassword', (req, res)=>{
    return res.render('pages/getForgotPassword');
  })

server.get('/login/success',(req, res)=>{
    return res.render('pages/getLoginSuccess')
  });

server.get('/secret', auth.isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user.id: ', req.user.id);
  console.log('req.username: ', req.user.username);
  res.redirect('/login/success');
});

server.get('/', (req, res) => {
    console.log('??????')
    console.log(req.user);
    console.log('???')
    res.render('pages/absoluteRoot', {user: req.user});
  })

// NETS
server.get('*', (req, res) => {
  res.send('Oops! You came across a bad URL!');
});

server.listen(PORT, () => {
  console.log(`connect to ${PORT} \n`);
});

