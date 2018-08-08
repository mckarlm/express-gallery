const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const Redis = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override')
const server = express();
const PORT = process.env.PORT || 4020;

const routes = require('./routes');

server.use(express.static('public'));
server.use(bodyparser.urlencoded({extended:true}));
server.use(bodyparser.json());

server.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

server.engine('.hbs', handlebars({
  defaultLayout : 'index',
  extname: '.hbs'
}));
server.set('view engine', '.hbs');

server.use('/', routes);

server.get('/', (req, res)=>{
  res.send('test page, should never be seen');
})

server.get('*', (req, res)=>{
  res.send('catch all');
})

server.listen(PORT, ()=>{
  console.log(`connect to ${PORT} \n`);
})