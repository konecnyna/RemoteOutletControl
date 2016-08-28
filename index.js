var PythonShell = require('python-shell');
var path = require('path');
var jsonfile = require('jsonfile');
var seqqueue = require('seq-queue');
var fs = require('fs');
var path = require('path');
var express = require('express');

var weather = require('./app/lib/weather.js');
var jsonHelper = require('./app/lib/jsonHelper.js');
var queue = seqqueue.createQueue(1000);

var DEBUG = false;

var localPath = path.join(__dirname, 'python/');
var pythonFile =  DEBUG ? 'test.py'  : 'ac_outlet_control.py';



var method = RemoteOutletControl.prototype;
function RemoteOutletControl(app, route) {
    if (route) {
        ROOT_PATH = route;
    } else {
        ROOT_PATH = "/";
    }

    console.log("running on:" + ROOT_PATH);

    app.use(ROOT_PATH, express.static(path.join(__dirname, 'app/dist')));

    app.get("/api/v1/state", function(req, res) {
        jsonHelper.getJSON(res, null);
    });

    app.get("/api/v1/weather", function(req, res) {
        weather.getForecastIOWeather(function(data) {
            res.json(data);
        });
    });

    app.get("/api/v1/updateJSON", function(req, res) {

        var outlet = req.param('outlet_number');
        var state = parseInt(req.param('state'));
        var type = req.param('type');

        if (outlet && (state === 0 || state === 1) && type) {
            queue.push(
                function(task) {
                    runPythonScript(outlet, state, type, function(data) {
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
        try {
            messageObject = JSON.parse(req.body.outlets);
            jsonfile.writeFile(jsonHelper.jsonFileName, messageObject, function(err) {
                if (err) {
                    console.error("error BLAH: " + err);
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


    function runPythonScript(outlet, state, type, callback) {
        var PythonShell = require('python-shell');
        var options = {
            scriptPath: localPath,
            mode: 'text',
            args: [type, outlet, state]
        };

        var pyshell = new PythonShell(pythonFile, options);
        pyshell.end(function(err) {
            console.log("error", err);

            jsonArray = jsonHelper.getJSON(null, function(jsonArray) {
                jsonHelper.updateJSONStates(outlet, state, jsonArray, function(json_data) {
                    callback(json_data);
                });

            });
        });
    }

}
module.exports = RemoteOutletControl;
