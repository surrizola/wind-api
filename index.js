const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5001
const cool = require('cool-ascii-faces')
//const https = require('https');
const request = require('request');

var HTMLParser = require('node-html-parser');




var degToCard = function(deg){
  if (deg>11.25 && deg<33.75){
    return "NNE";
  }else if (deg>33.75 && deg<56.25){
    return "ENE";
  }else if (deg>56.25 && deg<78.75){
    return "E";
  }else if (deg>78.75 && deg<101.25){
    return "ESE";
  }else if (deg>101.25 && deg<123.75){
    return "ESE";
  }else if (deg>123.75 && deg<146.25){
    return "SE";
  }else if (deg>146.25 && deg<168.75){
    return "SSE";
  }else if (deg>168.75 && deg<191.25){
    return "S";
  }else if (deg>191.25 && deg<213.75){
    return "SSW";
  }else if (deg>213.75 && deg<236.25){
    return "SW";
  }else if (deg>236.25 && deg<258.75){
    return "WSW";
  }else if (deg>258.75 && deg<281.25){
    return "W";
  }else if (deg>281.25 && deg<303.75){
    return "WNW";
  }else if (deg>303.75 && deg<326.25){
    return "NW";
  }else if (deg>326.25 && deg<348.75){
    return "NNW";
  }else{
    return "N"; 
  }
}


function callstats(callback){
  var url = "https://meteo.comisionriodelaplata.org/ecsCommand.php?c=telemetry/updateTelemetry&p=1&p1=2&p2=1&p3=1&p4=update";      
             
  var options = {
    rejectUnauthorized: false ,
      headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
              'Accept': '/',
              'Connection': 'keep-alive'
      }
  };      
  request("https://meteo.comisionriodelaplata.org/ecsCommand.php?c=telemetry/updateTelemetry", options , (err, res, body) => {
      if (err) { return console.log(err); }
      var responseCookies = res.headers['set-cookie'];
      var requestCookies='';
      for(var i=0; i<responseCookies.length; i++){
          var oneCookie = responseCookies[i];
          oneCookie = oneCookie.split(';');
          requestCookies= requestCookies + oneCookie[0]+';';            
      }
      var cookieString = requestCookies+ 'expires=' + new Date(new Date().getTime() + 86409000);
      var cookie = request.cookie(cookieString);
      options.headers['Cookie']=cookie;
      request(url, options , (err, res, body) => {
          if (err) { return console.log(err); }
          console.log('** RES STATS CODE 200 **');
          console.log('PROCC REQUEST');
          result = body.substr(body.indexOf("{"));
          var dataFull = JSON.parse(result);
          data = dataFull.wind.latest;
          console.log(" ************  PROCESOS ======================= WIND.LATEST")
          decoded = decodeURIComponent(data);
          const root = HTMLParser.parse(decoded);
    
          var list = root.querySelectorAll("tr td");      
          var dir = list[4].rawText;
          var dirCard = degToCard(dir);
          console.log("DATE     "+list[0].rawText);
          console.log("SPEED    "+list[1].rawText);
          console.log("GUST     "+list[2].rawText);
          console.log("DIR      "+dir);
          console.log("DIRCARD  "+dirCard);

          callback( {
            date:list[0].rawText,
            speed:list[1].rawText,
            gust:list[2].rawText,
            dir:list[4].rawText,
            dirCard :dirCard ,
          }, dataFull);
          //callback(data.wind.latest);
        });    
    });
  
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  .get('/db2', (req, res) => res.render('pages/db'))

  .get('/debug', (req, res) => {
    callstats(function(data, dataFull){
      res.render('pages/debug', {data:data, dataFull: dataFull});
    })
    
  })


  .get('/', (req, res) => {
    callstats(function(data, dataFull){
      res.render('pages/index', {data:data, dataFull: dataFull});
    })
    
  })
  .get('/cool', (req, res) => res.send(cool()))


  .get('/wind', (req, res) =>  callstats(function(data){
    res.send(data);
  })


  )





  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
