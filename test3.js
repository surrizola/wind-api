const https = require('https');
var HTMLParser = require('node-html-parser');

const request = require('request');


//var url = "https://meteo.comisionriodelaplata.org/ecsCommand.php?c=telemetry/updateTelemetry";



console.log(' ====== TEST ======');




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
            data = JSON.parse(result);
            callback(data.wind.latest, data);
          });    
      });
    
  }

  function processLatest(data, dataAll){
      console.log(" ************  PROCESOS ======================= WIND.LATEST")
      decoded = decodeURIComponent(data);
      const root = HTMLParser.parse(decoded);

      var list = root.querySelectorAll("tr td");      
      console.log("DATE     "+list[0].rawText);
      console.log("SPEED    "+list[1].rawText);
      console.log("GUST     "+list[2].rawText);
      console.log("DIR      "+list[4].rawText);


        //Tabala con historia
      //console.log(dataAll.wind.chart.history.series[0].data);
      
      console.log(dataAll.wind.chart.gust.series);
      console.log(dataAll.wind.chart.gust.series[0]);
      console.log(dataAll.wind.chart.gust.series[1]);

      for(var i=0; i<dataAll.wind.chart.gust.series[1].data.length; i++){
            time = dataAll.wind.chart.gust.series[0].data[i][0];
            wind = dataAll.wind.chart.gust.series[1].data[i][1];
            gust = dataAll.wind.chart.gust.series[0].data[i][1]
            timeS = new Date(time);
            console.log(time + ' ' +timeS.toLocaleString() + " = "+wind + " ; "+gust);
            
      }
/*
      dataAll.wind.chart.gust.series[1].data.forEach(element => {
          console.log(element[0] + " = "+element[1]);
      });
      */
  }



  callstats(processLatest);
