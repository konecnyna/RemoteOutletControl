var PythonShell = require('python-shell');
var weather = require('./lib/weather.js');
var jsonHelper = require('./lib/jsonHelper.js');
var fs = require('fs');
var path = require('path');
var express = require('express');
var jsonfile = require('jsonfile');
var app = express();
var seqqueue = require('seq-queue');
var queue = seqqueue.createQueue(1000);

var debug = false;
var localPath = '/home/pi/Github/rpi_ac_outlet_control/python';
var pythonFile = 'ac_outlet_control.py';
var credsFile = '/home/pi/Github/rpi_ac_outlet_control/web/creds.dat';




// REACT
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;




if(debug){
   localPath = '/Users/Nick/Github/rpi_ac_outlet_control/python';
   pythonFile = 'test.py';
   credsFile = 'creds.dat';
}


// app.get("/", function(req,res){
//    res.redirect("/dashboard");   
// });

app.get("/state", function(req, res) {
   jsonHelper.getJSON(res, null);
});

app.get("/weather", function(req, res){
   weather.getForecastIOWeather(function(data){
      res.json(data);
   });
});

app.get("/updateJSON", function(req, res){

   var outlet = req.param('outlet_number');
   var state = parseInt(req.param('state'));
   if(outlet && (state === 0 || state === 1)){ 
    queue.push(
      function(task) {      
        runPythonScript(outlet,state, function(data) {
          res.send(data);
          task.done();
        });                
      }, 
      function() {
        console.log('task timeout');
      }, 5000);

      
   }else{
      console.log("Invalid request");
      res.status(400);
      res.json({error: "Invalid request"});
   }
});


app.post('/api/v1/update_outlets', function(req, res) {    
  console.log(req.body);
  try {    
    messageObject = JSON.parse(req.body.outlets);
    jsonfile.writeFile(jsonHelper.jsonFileName, messageObject, function (err) {
      if(err){
        console.error("error: " + err);
        res.status(400);
        res.json({error: err});  
      }else{
        res.status(200);
        res.json("Saved"); 
      }             
    });

  } catch(e) {     
    console.log(e);
    res.status(400);
    res.json({error: "Invalid request"});
  }

});



// Authenticator
fs.readFile(credsFile, 'utf8', function (err,password) {
   if (err) {
      console.log("Error - no creds.dat file so no auth!");
   }else{
      console.log("asking for auth!");
      app.use(function(req, res, next) {
         var auth;
         if (req.headers.authorization) {
            auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
          }
          if (!auth || auth[0] !== 'admin' || auth[1] !== password.trim()) {
              res.statusCode = 401;
              res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
              res.end('Unauthorized');
          } else {
              next();
          }
      });
   }
  
  
  if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
      publicPath: config.output.publicPath,
      contentBase: 'src',
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));    
  } else {
    app.use(express.static(path.join(__dirname, 'public')));    
  }

  app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
      console.log(err);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  });

});



function runPythonScript(outlet, state, callback){
   var PythonShell = require('python-shell');
   var options = {
      scriptPath: localPath,
      mode: 'text',
      args: [outlet, state]
   };

   var pyshell = new PythonShell(pythonFile, options);
   pyshell.end(function (err) {
      console.log(err);
      //if (err) throw err;
      jsonArray = jsonHelper.getJSON(null, function(jsonArray){            
         jsonHelper.updateJSONStates(outlet, state, jsonArray, function(json_data){
            callback(json_data); 
         });
         
      });
   });      
}
