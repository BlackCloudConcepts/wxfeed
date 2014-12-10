var request = require('request');
var Firebase = require('firebase');
var dataRef = new Firebase('https://resplendent-heat-1209.firebaseio.com/wx/');

var locations = [
	'Austin,TX',
	'Buda,TX',
	'Burnet,TX',
	'Dripping Springs,TX',
	'Fredericksburg,TX',
	'Georgetown,TX',
	'Johnson City,TX',
	'Llano,TX',
	'Lockhart,TX',
	'New Braunfels,TX',
	'San Antonio,TX',
	'San Marcos,TX',
	'Temple,TX',
	'Chickasha,OK',
	'ElReno,OK',
	'Guthrie,OK',
	'Harrah,OK',
	'Kingfisher,OK',
	'Moore,OK',
	'Norman,OK',
	'Oklahoma City,OK',
];
setInterval(function(){
        for (var i = 0;i < locations.length;i++){
                getWeatherData(locations[i]);
        }
}, 10000);

function getWeatherData(loc){
        var options = {
                url: 'http://api.openweathermap.org/data/2.5/weather?q='+loc+'&APPID=4ad88837f1ea247954d4011aac2e4c9c',
                method: 'GET'
        }

        request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body);
                        var obj = {};
                        obj['_'+loc] = data;
                        dataRef.update(obj);
                }
        })
}
