const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000
const request = require('request');
const pilote = require('./pilote');
const bodyParser = require('body-parser');


//process.env.TZ = "America/New_York";

function callstats(callback){
  console.log("get data from index");
  pilote.get_data(function(results){
    //console.log(results)
    callback( results);
  });
  
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .use(bodyParser.urlencoded({extended:false}))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  .get('/db2', (req, res) => res.render('pages/db'))

  .get('/debug', (req, res) => {
    callstats(function(data){
      res.render('pages/debug', {data:data});
    })
  })


  .get('/', (req, res) => {
    console.log("home")
    callstats(function(data){
      res.render('pages/index', {data:data});
    })
    
  })


  .get('/wind', (req, res) =>  callstats(function(data, dataFull){
    res.send(dataFull);
  })


  )





  .listen(PORT, () => console.log(`Gaucho WIND Listening on ${ PORT }`))

  console.log('Gaucho WIND  Server running at http://127.0.0.1:' + PORT + '/');
