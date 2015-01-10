var request = require('request');
var Firebase = require('firebase');
var dataRef = new Firebase('https://resplendent-heat-1209.firebaseio.com/wx/');

var locations = [
	{city:'Austin,TX',region:'TX'},
	{city:'Buda,TX',region:'TX'},
	{city:'Burnet,TX',region:'TX'},
	{city:'Dripping Springs,TX',region:'TX'},
	{city:'Fredericksburg,TX',region:'TX'},
	{city:'Georgetown,TX',region:'TX'},
	{city:'Johnson City,TX',region:'TX'},
	{city:'Llano,TX',region:'TX'},
	{city:'Lockhart,TX',region:'TX'},
	{city:'New Braunfels,TX',region:'TX'},
	{city:'San Antonio,TX',region:'TX'},
	{city:'San Marcos,TX',region:'TX'},
	{city:'Temple,TX',region:'TX'},
	{city:'Chickasha,OK',region:'OK'},
	{city:'El Reno,OK',region:'OK'},
	{city:'Guthrie,OK',region:'OK'},
	{city:'Harrah,OK',region:'OK'},
	{city:'Kingfisher,OK',region:'OK'},
	{city:'Moore,OK',region:'OK'},
	{city:'Norman,OK',region:'OK'},
	{city:'Oklahoma City,OK',region:'OK'}
];

// get weather initially and then every 60 seconds
queryWeather();
setInterval(function(){
       queryWeather();
}, 60000);

function queryWeather(){
	var time = new Date();
	console.log('LOG: QUERY WEATHER DATA '+time.toLocaleDateString()+" "+time.toLocaleTimeString());
	for (var i = 0;i < locations.length;i++){
                getWeatherData(locations[i]);
        }
}

function getWeatherData(loc){
        var options = {
                url: 'http://api.openweathermap.org/data/2.5/weather?q='+loc.city+'&APPID=4ad88837f1ea247954d4011aac2e4c9c',
                method: 'GET'
        }

        request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body);
			data.region = loc.region;
                        var obj = {};
                        obj['_'+loc.city] = data;
			// issue with Moore, OK returned as Oklahoma City by name
			obj['_'+loc.city].name = loc.city.split(',')[0];
                        dataRef.update(obj);
                }
        })
}
