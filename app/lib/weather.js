var http = require('http');
var util = require('util');
var moment = require('moment');
var utils = require('./utils.js');
var imgBaseUrl = 'http://l.yimg.com/a/i/us/we/52/%s.gif';
module.exports = {
  getForecastIOWeather: function (callback) {
    getForecastIOWeather(callback);
  }
};



function getForecastIOWeather(callback){
	var forecast = 'https://api.forecast.io/forecast/ab4397914a446e55d16d43db59026d56/40.733860,-74.004998';
	utils.downloadFileSSL(forecast, function(jsonStr){
		callback(formatForecastIOData(JSON.parse(jsonStr)));
	});
}


function formatForecastIOData(data){
	data.currently.humidity = parseInt(data.currently.humidity * 100);
	data.currently.temperature = parseInt(data.currently.temperature);
	
	data.currently.imgs = ["http://images.webcamgalore.com/5943-current-webcam-New-York-City-New-York.jpg?time=" + new Date(),"http://images.intellicast.com/WxImages/RadarLoop/hfd_None_anim.gif"];
	//data.currently.imgs = ["http://images.webcamgalore.com/5943-current-webcam-New-York-City-New-York.jpg?time=" + new Date(),"http://sirocco.accuweather.com/nx_mosaic_640x480_public/sir/inmsirny_.gif"];
	
	data.daily.data = data.daily.data.slice(0, 5);

	for(var i=0; i<data.daily.data.length; i++){
		var currentItem = data.daily.data[i];
		currentItem.time = moment(currentItem.time*1000).format('ddd');
		currentItem.temperatureMax = Math.round(currentItem.temperatureMax);
		currentItem.temperatureMin = Math.round(currentItem.temperatureMin);

		if(i === 0){
			data.currently.sunriseTime = moment(currentItem.sunriseTime*1000).format('hh:mm a');
			data.currently.sunsetTime = moment(currentItem.sunsetTime*1000).format('hh:mm a');
		}
	}
	return data;
}