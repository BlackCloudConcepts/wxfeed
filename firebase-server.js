var request = require('request');
var Firebase = require('firebase');
var dataRef = new Firebase('https://resplendent-heat-1209.firebaseio.com/wx/');

var locations = [
	{city:'Austin,TX',region:'TX',id:4671654},
	{city:'Buda,TX',region:'TX',id:4050880},
	{city:'Burnet,TX',region:'TX',id:4677592},
	{city:'Dripping Springs,TX',region:'TX',id:4686903},
	{city:'Fredericksburg,TX',region:'TX',id:4692279},
	{city:'Georgetown,TX',region:'TX',id:4693342},
	{city:'Johnson City,TX',region:'TX',id:4701346},
	{city:'Llano,TX',region:'TX',id:4707191},
	{city:'Lockhart,TX',region:'TX',id:4707295},
	{city:'New Braunfels,TX',region:'TX',id:4714131},
	{city:'San Antonio,TX',region:'TX',id:4726206},
	{city:'San Marcos,TX',region:'TX',id:4726491},
	{city:'Temple,TX',region:'TX',id:4735966},
	{city:'Chickasha,OK',region:'OK',id:4533029},
	{city:'El Reno,OK',region:'OK',id:4535783},
	{city:'Guthrie,OK',region:'OK',id:4538142},
	{city:'Harrah,OK',region:'OK',id:4538346},
	{city:'Kingfisher,OK',region:'OK',id:4540313},
	{city:'Moore,OK',region:'OK',id:4542975},
	{city:'Norman,OK',region:'OK',id:4543762},
	{city:'Oklahoma City,OK',region:'OK',id:4544349}
];

// get weather initially and then every 60 seconds
queryWeather();
setInterval(function(){
       queryWeather();
}, 60000);

// -- wrapper function to query weather either on an individual basis or in a batch
function queryWeather(){
	var time = new Date();
	console.log('LOG: QUERY WEATHER DATA '+time.toLocaleDateString()+" "+time.toLocaleTimeString());

	// individual
/*
	for (var i = 0;i < locations.length;i++){
                getWeatherData(locations[i]);
        }
*/

	// batch
	getWeatherDataBatch(locations);
}

// -- function to retrieve and emit data updates on an individual basis
// input: loc
function getWeatherData(loc){
        var options = {
                url: 'http://api.openweathermap.org/data/2.5/weather?q='+loc.city+'&APPID=4ad88837f1ea247954d4011aac2e4c9c',
                method: 'GET'
        };

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
        });
}


// -- function to retrieve and emit data updates on a batch call
// input: loc
function getWeatherDataBatch(loc){
	var strIds = '';
	for (var i = 0;i < loc.length;i++){
		strIds += loc[i].id+',';
	}

	// create lookup object
	var objLookup = {};
	for (var i = 0; i < loc.length; i++) {
    		objLookup[loc[i].id] = loc[i];
	}
	strIds = strIds.substring(0,strIds.length-1);

	var options = {
                url: 'http://api.openweathermap.org/data/2.5/group?id='+strIds+'&APPID=4ad88837f1ea247954d4011aac2e4c9c',
                method: 'GET'
        };

        request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body);
			for (var i = 0;i < data.list.length;i++){
				data.list[i].region = objLookup[data.list[i].id].region;
				var obj = {};
				obj['_'+objLookup[data.list[i].id].city] = data.list[i];
				// issue with Moore, OK returned as Oklahoma City by name
				obj['_'+objLookup[data.list[i].id].city].name = objLookup[data.list[i].id].city.split(',')[0];
				dataRef.update(obj);	
			}
                }
        });
}
