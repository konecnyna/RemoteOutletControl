var PythonShell = require("python-shell");
var path = require("path");
var jsonfile = require("jsonfile");
var seqqueue = require("seq-queue");
var fs = require("fs");
var path = require("path");
var express = require("express");
var request = require("request");

var weather = require("./app/lib/weather.js");
var jsonHelper = require("./app/lib/jsonHelper.js");
var queue = seqqueue.createQueue(1000);

var DEBUG = false;

var localPath = path.join(__dirname, "python/");
var pythonFile = DEBUG ? "test.py" : "ac_outlet_control.py";


var method = RemoteOutletControl.prototype;
function RemoteOutletControl(app, secrets, route) {
  if (route) {
    ROOT_PATH = route;
  } else {
    ROOT_PATH = "/";
  }
  console.log("running on:" + ROOT_PATH);

  if (!secrets) {
    console.error("No secrets provided to remote outlet control");
  }

  app.use(ROOT_PATH, express.static(path.join(__dirname, "app/dist")));

  app.get("/api/v1/state", function(req, res) {
    jsonHelper.getJSON(res, null);
  });

  app.get("/api/v1/updateJSON", function(req, res) {
    var outlet = req.query.outlet;
    var state = req.query.state;
    var ac = req.query.is_auto_ac_request
    sendSignal(outlet, state, ac, res);
  });

  app.post("/api/v1/update_outlets", function(req, res) {
    try {
      messageObject = JSON.parse(req.body.outlets);
      jsonfile.writeFile(jsonHelper.jsonFileName, messageObject, function(err) {
        if (err) {
          res.status(400);
          res.json({
            error: err
          });
        } else {
          res.status(200);
          res.json("Saved");
        }
      });
    } catch (e) {
      console.log("hi", e);
      res.status(400);
      res.json({
        error: "Invalid request"
      });
    }
  });


  app.get("/api/v1/nighttime", async (req, res) => {
    sendSignal("ac", "on", false, res);
    sendSignal("fan", "on", false, res);
    sendSignal("fireplace", "off", false, res);
  });

  function runPythonScript(outlet, state, callback) {
    try {
      jsonHelper.getJSON(null, function(jsonArray) {
        var PythonShell = require("python-shell");
        var options = {
          scriptPath: localPath,
          mode: "text",
          args: [jsonArray[outlet].type, jsonArray[outlet].outlet_number, state]
        };

        var pyshell = new PythonShell(pythonFile, options);
        pyshell.end(function(err) {
          if (err) {
            callback(null, err);
            return;
          }

          jsonHelper.updateJSONStates(outlet, state, jsonArray, function(
            json_data
          ) {
            callback(json_data);
          });
        });
      });
    } catch(e) {
      callback([])
    }
  }

  function sendSignal(outlet, state, autoAc, res) {
      if (state === "on" || state === "On") {
      state = 1;
    } else if (state === "off" || state === "Off") {
      state = 0;
    } else {
      state = parseInt(state);
    }

    if (outlet === "ac" && autoAc === undefined) {
      let updateState = 'off';
      if (state === 1) {
        updateState = 'on';
      }
      // Auto ac. Anytime ac state changes thats not auto turn off.
      request(
        {
          url: `${secrets.thermostat_update_endpoint}?state=${updateState}`
        },
        function(error, response, body) {
          if (error || response.statusCode !== 200) {
            console.error("Status code: " + response.statusCode, error);
          }
        }
      );
    }

    if (outlet && (state === 0 || state === 1)) {
      queue.push(
        function(task) {
          runPythonScript(outlet, state, function(data, err) {
            if (err) {
              res.status(400);
              res.json(err);
              return;
            }
            res.send(data);
            task.done();
          });
        },
        function() {
          //console.log('task timeout');
        },
        5000
      );
    } else {
      console.log("Invalid request");
      res.status(400);
      res.json({
        error: "Invalid request"
      });
    }
}
}

module.exports = RemoteOutletControl;
