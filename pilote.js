const request = require('request');
var HTMLParser = require('node-html-parser');
const constants = require('constants'); // Agregar constantes de OpenSSL
const https = require('https');
//const request = require('request');
const axios = require('axios');
const tls = require('tls');

// Crear un agente personalizado que permita conexiones inseguras
const agentOptions = {
  rejectUnauthorized: false, // Desactivar verificación de certificados
  //secureOptions: constants.SSL_OP_NO_TLSv1_2, // Desactivar TLS 1.2 si es necesario (prueba con/si)
  //secureOptions: constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,  // Permitir claves DH pequeñas
  secureOptions: constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,  // Permitir claves DH pequeñas
  //secureOptions: tls.constants.SSL_OP_SINGLE_DH_USE | tls.constants.SSL_OP_NO_SSLv3 | tls.constants.SSL_OP_NO_SSLv2, // Desactivar claves DH pequeñas
  ciphers: 'HIGH:!DH:!aNULL',  // Evitar suites de cifrado con DH pequeñas
  secureProtocol: 'TLSv1_2_method'  // Forzar uso de TLS 1.2
  


};
const agent = new https.Agent(agentOptions);



exports.test = test;
exports.get_data = get_data;

function test() {
  return 2;
}




const url = "https://meteo.comisionriodelaplata.org/ecsCommand.php?c=telemetry/updateTelemetry&p=1&p1=2&p2=1&p3=1&p4=update"

function get_data(callback) {
  get_cookies(function (options) {

    console.log("llamando a pilote ");

    axios.get(url, options)
      .then((response) => {
        console.log('PROCC REQUEST');
        var body = response.data;
        var result = body.substr(body.indexOf("{"));
        //console.log(result);
        var dataFull = JSON.parse(result);
        var data = dataFull.wind.latest;
        console.log(" ************  PROCESOS ======================= WIND.LATEST")
        decoded = decodeURIComponent(data);
        const root = HTMLParser.parse(decoded);

        var list = root.querySelectorAll("tr td");
        var dir = list[4].rawText;
        var dirCard = degToCard(dir);
        console.log("DATE     " + list[0].rawText);
        console.log("SPEED    " + list[1].rawText);
        console.log("GUST     " + list[2].rawText);
        console.log("DIR      " + dir);
        console.log("DIRCARD  " + dirCard);

        callback({
          date: list[0].rawText,
          speed: list[1].rawText,
          gust: list[2].rawText,
          dir: list[4].rawText,
          dirCard: dirCard,
          dataFull: dataFull
        });

      })
      .catch((error) => {
        console.log('Error en url');
        console.error(error);  // Mostrar el error
      });




/*     request(url, options, (err, res, body) => {
      if (err) {
        console.log("error en pilote request")
        return console.log(err);
      }
      console.log('PROCC REQUEST');
      var result = body.substr(body.indexOf("{"));
      //console.log(result);
      var dataFull = JSON.parse(result);
      var data = dataFull.wind.latest;
      console.log(" ************  PROCESOS ======================= WIND.LATEST")
      decoded = decodeURIComponent(data);
      const root = HTMLParser.parse(decoded);

      var list = root.querySelectorAll("tr td");
      var dir = list[4].rawText;
      var dirCard = degToCard(dir);
      console.log("DATE     " + list[0].rawText);
      console.log("SPEED    " + list[1].rawText);
      console.log("GUST     " + list[2].rawText);
      console.log("DIR      " + dir);
      console.log("DIRCARD  " + dirCard);

      callback({
        date: list[0].rawText,
        speed: list[1].rawText,
        gust: list[2].rawText,
        dir: list[4].rawText,
        dirCard: dirCard,
        dataFull: dataFull
      });

    }); */



  });


}


const url_inicial = "https://meteo.comisionriodelaplata.org/ecsCommand.php?c=telemetry/updateTelemetry&p=1&p1=2&p2=1&p3=1&p4=update";



async function get_cookies(callback) {
  console.log("llamando a cookies")
  var options = {
    httpsAgent: agent,
    //rejectUnauthorized: false ,
    //secureOptions: constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION, // Permitir claves DH pequeñas
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
      'Accept': '/',
      'Connection': 'keep-alive'
    }
  };

  //console.log(options);
  axios.get("https://meteo.comisionriodelaplata.org/ecsCommand.php?c=telemetry/updateTelemetry", options)
    .then((response) => {
      //console.log(response.data);  // Procesar el cuerpo de la respuesta
      var responseCookies = response.headers['set-cookie'];
      var requestCookies = '';
      for (var i = 0; i < responseCookies.length; i++) {
        var oneCookie = responseCookies[i];
        oneCookie = oneCookie.split(';');
        requestCookies = requestCookies + oneCookie[0] + ';';
      }
      var cookieString = requestCookies + 'expires=' + new Date(new Date().getTime() + 86409000);
      var cookie = request.cookie(cookieString);
      options.headers['Cookie'] = cookie;
      callback(options);
    })
    .catch((error) => {
      console.log('Error en cookies');
      console.error(error);  // Mostrar el error
    });




}





var degToCard = function (deg) {
  if (deg > 11.25 && deg < 33.75) {
    return "NNE";
  } else if (deg > 33.75 && deg < 56.25) {
    return "ENE";
  } else if (deg > 56.25 && deg < 78.75) {
    return "E";
  } else if (deg > 78.75 && deg < 101.25) {
    return "ESE";
  } else if (deg > 101.25 && deg < 123.75) {
    return "ESE";
  } else if (deg > 123.75 && deg < 146.25) {
    return "SE";
  } else if (deg > 146.25 && deg < 168.75) {
    return "SSE";
  } else if (deg > 168.75 && deg < 191.25) {
    return "S";
  } else if (deg > 191.25 && deg < 213.75) {
    return "SSW";
  } else if (deg > 213.75 && deg < 236.25) {
    return "SW";
  } else if (deg > 236.25 && deg < 258.75) {
    return "WSW";
  } else if (deg > 258.75 && deg < 281.25) {
    return "W";
  } else if (deg > 281.25 && deg < 303.75) {
    return "WNW";
  } else if (deg > 303.75 && deg < 326.25) {
    return "NW";
  } else if (deg > 326.25 && deg < 348.75) {
    return "NNW";
  } else {
    return "N";
  }
}