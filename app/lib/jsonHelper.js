var fs = require('fs');
var jsonFileName = __dirname + "/state.json";


module.exports = {
  getJSON: function (res, callback) {
  	getJSON(res, callback);
  },
  updateJSONFile: function (jsonArray) {
    updateJSONFile(jsonArray);
  },
  updateJSONStates: function (outlet, state, jsonArray, callback){
  	updateJSONStates(outlet, state, jsonArray, callback);
  },
};

var initJson = {
    "all": {
        "key": "all",
        "type": "byebye",
        "alias": "All Outlets",
        "state": "0",
        "outlet_number": "0",
        "owner": "nick",
        "hidden": false
    },
    "fireplace": {
        "key": "fireplace",
        "type": "zap",
        "alias": "Fireplace",
        "state": 0,
        "outlet_number": "2",
        "owner": "nick",
        "hidden": false
    },
    "ac": {
        "key": "ac",
        "type": "zap",
        "alias": "Air Conditioner",
        "state": 0,
        "outlet_number": "3",
        "owner": "all",
        "hidden": false
    },
    "shield": {
        "key": "shield",
        "type": "byebye",
        "alias": "Nvidia Shield",
        "state": 0,
        "outlet_number": "4",
        "owner": "nick",
        "hidden": false
    },    
    "livinglamp": {
        "key": "livinglamp",
        "type": "zap",
        "alias": "Living lamp",
        "state": 0,
        "outlet_number": "1",
        "owner": "nick",
        "hidden": false
    },
    "fan": {
        "key": "fan",
        "type": "zap",
        "alias": "Fan",
        "state": 0,
        "outlet_number": "5",
        "owner": "nick",
        "hidden": false
    }
};


function updateJSONStates(key, state, jsonArray, callback){
  
  if (key === "all") {
    Object.keys(jsonArray).map(function(key){
      if (jsonArray[key].type === "byebye") {
        jsonArray[key].state = state;   
      }
    });    
	} else {
    jsonArray[key].state = state;    
	}

	updateJSONFile(jsonArray);
	callback(jsonArray);
}

function getJSON(res, callback){
   fs.readFile(jsonFileName, 'utf8', function (err, stateData) {      
      try {
        stateData = JSON.parse(stateData);
      } catch(e) {
        stateData = "";
        console.log("Bad json statedata", e);
      }
        

      if(stateData === "" || !stateData){
  			console.log("EMPTY DATA");
        updateJSONFile(initJson);
        stateData = initJson;
  		}else if(err){
        console.log("fookin error!");
        updateJSONFile(initJson);
        stateData = initJson;
      }


      
      if (res !== null) {
         res.send(stateData);
      } else if(callback !== null) {
         return callback(stateData);
      }

   });
}

function updateJSONFile(jsonArray){
   fs.writeFile(jsonFileName, JSON.stringify(jsonArray, null, 4), function(err) {
      if(err) {
         console.log(err);
      }
   }); 
}



