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

var initJson = [
    {
        "type": "byebye",
        "alias": "All Outlets",
        "state": "0",
        "outlet_number": "0",
        "owner": "nick",
        "hidden": false
    },
    {
        "type": "byebye",
        "alias": "null",
        "state": 0,
        "outlet_number": "1",
        "owner": "all",
        "hidden": false
    },
    {
        "type": "byebye",
        "alias": "Spotlight",
        "state": 0,
        "outlet_number": "2",
        "owner": "nick",
        "hidden": false
    },
    {
        "type": "zap",
        "alias": "Air Conditioner",
        "state": 0,
        "outlet_number": "3",
        "owner": "all",
        "hidden": false
    },
    {
        "type": "byebye",
        "alias": "Bedroom light",
        "state": 0,
        "outlet_number": "4",
        "owner": "nick",
        "hidden": false
    },
    {
        "type": "byebye",
        "alias": "null",
        "state": 0,
        "outlet_number": "5",
        "owner": "nick",
        "hidden": false
    },
    {
        "type": "byebye",
        "alias": "Living lamp",
        "state": 0,
        "outlet_number": "6",
        "owner": "nick",
        "hidden": false
    }
];


function updateJSONStates(outlet, state, jsonArray, callback){
  
  if (parseInt(outlet) === 0) {
    for (var i=1; i<jsonArray.length; i++) {
      jsonArray[i].state = state;	
    }
	} else {
		jsonArray[outlet].state = state;    
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



