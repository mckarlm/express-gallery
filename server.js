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

const saltRounds = 12;
const server = express();
const PORT = process.env.PORT || 4020;

server.use(express.static('public'));

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

// PASSPORT
server.use(passport.initialize());
server.use(passport.session());



// NETS
server.get('*', (req, res) => {
  res.send('Oops! You came across a bad URL!');
});

server.listen(PORT, () => {
  console.log(`connect to ${PORT} \n`);
});

