const express = require('express');
const bodyparser = require('body-parser');
const handlebars = require('express-handlebars');
const routes = require('./routes');
const server = express();
const PORT = process.env.PORT || 4020;

server.use(bodyparser.urlencoded({extended:true}));
server.use(bodyparser.json());

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

/*
==================DELETE THIS LATER================= 
GALLERY TABLE
id            integer
author        string(50)
link(url)     string(16)
description   text
*/