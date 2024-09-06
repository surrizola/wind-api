const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cool = require('cool-ascii-faces')
//const https = require('https');
const request = require('request');

var HTMLParser = require('node-html-parser');

var url = "https://meteo.comisionriodelaplata.org/ecsCommand.php?c=telemetry/updateTelemetry&p=1&p1=2&p2=1&p3=1&p4=update";
var cookieString = 'mariweb_session=a8d6e33bdb5ed9e920ea5046ecc9021c; expires=' + new Date(new Date().getTime() + 86409000);
var cookie = request.cookie(cookieString);
var options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
            'Cookie': cookie,
            'Accept': '/',
            'Connection': 'keep-alive'
    }
};

function callWind(callback){
  request(url, options , (err, res, body) => {
    if (err) { return console.log(err); }
    result = body.substr(body.indexOf("{"));
    //console.log(result)
    
    data = JSON.parse(result);
    console.log(" ************  PROCESOS ======================= WIND.LATEST")
    //console.log(data)
    data = data.wind.latest;
    decoded = decodeURIComponent(data);
    
    const root = HTMLParser.parse(decoded);
    
    var list =root.querySelectorAll("tr td");      
    console.log("DATE     "+list[0].rawText);
    console.log("SPEED    "+list[1].rawText);
    console.log("GUST     "+list[2].rawText);
    console.log("DIR      "+list[4].rawText);
    callback( {
      date:list[0].rawText,
      speed:list[1].rawText,
      gust:list[2].rawText,
      dir:list[4].rawText,
    });

  });

}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))


  .get('/wind', (req, res) =>  callWind(function(data){
    res.send(data);
  })


  )





  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
