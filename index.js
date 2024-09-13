const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5001
const request = require('request');
const pilote = require('./pilote');


//process.env.TZ = "America/New_York";

function callstats(callback){
  pilote.get_data(function(results){
    console.log(results)
    callback( results);
  });
  
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  .get('/db2', (req, res) => res.render('pages/db'))

  .get('/debug', (req, res) => {
    callstats(function(data){
      res.render('pages/debug', {data:data});
    })
  })


  .get('/', (req, res) => {
    callstats(function(data){
      res.render('pages/index', {data:data});
    })
    
  })


  .get('/wind', (req, res) =>  callstats(function(data, dataFull){
    res.send(dataFull);
  })


  )





  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
