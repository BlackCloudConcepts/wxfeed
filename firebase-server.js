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

var extA = [
	{city:'Abilene,TX',region:'TX',id:4669635},
	{city:'Amarillo,TX',region:'TX',id:5516233},
	{city:'Beaumont,TX',region:'TX',id:4672989},
	{city:'Brady,TX',region:'TX',id:4676032},
	{city:'Brownwood,TX',region:'TX',id:4676798},
	{city:'College Station,TX',region:'TX',id:4682464},
	{city:'Colorado City,TX',region:'TX',id:5519254},
	{city:'Dallas,TX',region:'TX',id:4684888},
	{city:'Eldorado,TX',region:'TX',id:5521036},
	{city:'Fort Stockton,TX',region:'TX',id:5521746},
	{city:'Graham,TX',region:'TX',id:4694420},
	{city:'Houston,TX',region:'TX',id:4699066},
	{city:'Huntsville,TX',region:'TX',id:4699540},
	{city:'Longview,TX',region:'TX',id:4707814}
];

var extB = [
	{city:'Lubbock,TX',region:'TX',id:5525577},
	{city:'Mason,TX',region:'TX',id:4709501},
	{city:'Menard,TX',region:'TX',id:4710697},
	{city:'Midland,TX',region:'TX',id:5526337},
	{city:'Nacagdoches,TX',region:'TX',id:4713735},
	{city:'Palestine,TX',region:'TX',id:4717232},
	{city:'Plainview,TX',region:'TX',id:5528450},
	{city:'San Angelo,TX',region:'TX',id:5530022},
	{city:'San Saba,TX',region:'TX',id:4726582},
	{city:'Sonora,TX',region:'TX',id:5531255},
	{city:'Stephenville,TX',region:'TX',id:4734350},
	{city:'Waco,TX',region:'TX',id:4739526},
	{city:'Wichita Falls,TX',region:'TX',id:4741752}
];

var extC = [
	{city:'Ada,OK',region:'OK',id:4529096},
	{city:'Altus,OK',region:'OK',id:4529292},
	{city:'Alva,OK',region:'OK',id:4529308},
	{city:'Ardmore,OK',region:'OK',id:4529469},
	{city:'Bartlesville,OK',region:'OK',id:4529987},
	{city:'Clinton,OK',region:'OK',id:4534117},
	{city:'Cushing,OK',region:'OK',id:4552215},
	{city:'Duncan,OK',region:'OK',id:4535389},
	{city:'Durant,OK',region:'OK',id:4535414},
	{city:'Elk City,OK',region:'OK',id:4535823},
	{city:'Enid,OK',region:'OK',id:4535961}
];

var extD = [
	{city:'Henryetta,OK',region:'OK',id:4538577},
	{city:'Hugo,OK',region:'OK',id:4539145},
	{city:'Lawton,OK',region:'OK',id:4540737},
	{city:'McAlester,OK',region:'OK',id:4542367},
	{city:'Muskogee,OK',region:'OK',id:4543338},
	{city:'Pauls Valley,OK',region:'OK',id:4547690},
	{city:'Ponca City,OK',region:'OK',id:4548267},
	{city:'Poteau,OK',region:'OK',id:4548233},
	{city:'Stigler,OK',region:'OK',id:4552206},
	{city:'Tulsa,OK',region:'OK',id:4553433},
	{city:'Woodward,OK',region:'OK',id:4556050},
	{city:'Vinita,OK',region:'OK',id:4538126}
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
	setTimeout(function(){
		getWeatherDataBatch(extA);
	}, 10000);
	setTimeout(function(){
		getWeatherDataBatch(extB);
	}, 20000);
	setTimeout(function(){
		getWeatherDataBatch(extC);
	}, 30000);
	setTimeout(function(){
		getWeatherDataBatch(extD);
	}, 40000);


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
