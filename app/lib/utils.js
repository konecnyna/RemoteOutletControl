var http = require('http');
var https = require('https');
var fs = require('fs');


module.exports = {
  downloadFile: function (url, callback) { downloadFile(url, callback);},
  downloadFileSSL: function (url, callback) { downloadFileSSL(url, callback);},
  downloadFileWithOptions: function (options, callback) { downloadFileWithOptions(options, callback);},
  writeFile: function (filename, data) { writeFile(filename, data);},
  readJSONFile: function (filename, callback) { readJSONFile(filename, callback);},
};


function downloadFile(url, callback){
    http.get(url, function(res) {
	    var body = '';
	    res.on('data', function(chunk) {
	        body += chunk;

	    });
	    res.on('end', function() {
	        callback(body);
	    });
	}).on('error', function(e) {
		console.log("Got error: ", e);
		callback("");
	});
}

function downloadFileSSL(url, callback){
    https.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            callback(body);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
        callback("");
    });
}

function downloadFileWithOptions(options, callback){
    var port = options.port == 443 ? https : http;

 	var req = port.request(options, function(res){
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function() {
            callback(body);
        });
    });

    req.on('error', function(err) {
        console.log("Got error: ", err);
        callback("");
    });

    req.end();
}


function writeFile(filename, data){
    
    fs.writeFile(filename, data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved : " + __dirname + "/" + filename);        
    });     
}

function readJSONFile(filename, callback){
    fs.readFile(filename, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      callback(JSON.parse(data));
    });
}