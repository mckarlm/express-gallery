const express = require('express');
const bodyparser = require('body-parser');
const PORT = process.env.PORT || 4020;
const routes = require('./routes');

const server = express();
server.use(bodyparser.urlencoded({extended:true}));
server.use('/', routes);

server.get('/', (req, res)=>{
  res.send('test page, should never be seen');
})

server.get('*', (req, res)=>{
  res.send('catch all');
})

server.listen(PORT, ()=>{
  console.log(`connect to ${PORT}`);
})

/*
==================DELETE THIS LATER================= 
GALLERY TABLE
id            integer
author        string(50)
link(url)     string(16)
description   text
*/