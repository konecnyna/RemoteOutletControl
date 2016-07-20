var PythonShell = require('python-shell');
var path = require('path');
var jsonfile = require('jsonfile');
var seqqueue = require('seq-queue');
var fs = require('fs');



var weather = require('./lib/weather.js');
var jsonHelper = require('./lib/jsonHelper.js');

var queue = seqqueue.createQueue(1000);
var debug = false;
var localPath = '/home/pi/Github/rpi_ac_outlet_control/python';
var pythonFile = 'ac_outlet_control.py';
var credsFile = '/home/pi/Github/rpi_ac_outlet_control/web/creds.dat';


if (debug) {
    localPath = '/Users/Nick/Github/rpi_ac_outlet_control/python';
    pythonFile = 'test.py';
    credsFile = 'creds.dat';
}


var method = RemoteOutletControl.prototype;

function RemoteOutletControl(app) {
    app.get("/state", function(req, res) {
        jsonHelper.getJSON(res, null);
    });

    app.get("/weather", function(req, res) {
        weather.getForecastIOWeather(function(data) {
            res.json(data);
        });
    });

    app.get("/updateJSON", function(req, res) {

        var outlet = req.param('outlet_number');
        var state = parseInt(req.param('state'));
        if (outlet && (state === 0 || state === 1)) {
            queue.push(
                function(task) {
                    runPythonScript(outlet, state, function(data) {
                        res.send(data);
                        task.done();
                    });
                },
                function() {
                    console.log('task timeout');
                }, 5000);


        } else {
            console.log("Invalid request");
            res.status(400);
            res.json({
                error: "Invalid request"
            });
        }
    });


    app.post('/api/v1/update_outlets', function(req, res) {
        console.log(req.body);
        try {
            messageObject = JSON.parse(req.body.outlets);
            jsonfile.writeFile(jsonHelper.jsonFileName, messageObject, function(err) {
                if (err) {
                    console.error("error: " + err);
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
            console.log(e);
            res.status(400);
            res.json({
                error: "Invalid request"
            });
        }

    });


    function runPythonScript(outlet, state, callback) {
        var PythonShell = require('python-shell');
        var options = {
            scriptPath: localPath,
            mode: 'text',
            args: [outlet, state]
        };

        var pyshell = new PythonShell(pythonFile, options);
        pyshell.end(function(err) {
            console.log(err);
            //if (err) throw err;
            jsonArray = jsonHelper.getJSON(null, function(jsonArray) {
                jsonHelper.updateJSONStates(outlet, state, jsonArray, function(json_data) {
                    callback(json_data);
                });

            });
        });
    }

}


module.exports = RemoteOutletControl;