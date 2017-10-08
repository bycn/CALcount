/**
 * Created by bryanchen on 10/7/17.
 */
var request = require('request');
var api_key = "Pjez9iI0fGDdsxSlXFENKpm1Kifi0wHidVRAenTK";
module.exports = function(req,res,next){

	var searchTerm = "raw broccoli";
	var ndbno;
	request("https://api.nal.usda.gov/ndb/search/?format=json&q="+searchTerm+"&ds=Standard Reference&sort=r&max=25&offset=0&api_key=" + api_key, function (error, response, body) {
  	console.log('error:', error); // Print the error if one occurred
 	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 	var foodItem = JSON.parse(body).list.item[0];
 	ndbno = foodItem.ndbno;
 	
	
	

		request("https://api.nal.usda.gov/ndb/V2/reports?ndbno="+ndbno+"&type=s&format=json&api_key=" + api_key, function (error, response, body) {
  		console.log('error:', error); // Print the error if one occurred
 		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 		var firstFood = JSON.parse(body).foods[0].food;
 		var firstFoodDesc = firstFood["desc"];
 		var firstFoodName = firstFoodDesc.name;
 		var firstFoodNutrients = firstFood.nutrients;
 		var result = {};
 		result.name = firstFoodName;
 		var nutrients = [];
 		result.nutrients = nutrients;
 		var LIMIT = 10
 		var count = Math.min(firstFoodNutrients.length , LIMIT);
 		var i;
 		for( i = 0; i < count; i++){
 			var startNutrient = firstFoodNutrients[i];
 			var name = startNutrient.name;
 			var value = startNutrient.value + " " + startNutrient.unit;
 			var nutrient = {};
 			nutrient[name.toString()] = value;
 			result.nutrients.push(nutrient);
 		}
 		
 		res.send(result);
 		
		});
	});
};