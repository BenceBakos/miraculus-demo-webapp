const MiracuolusDeer = function (ops) {
	const apiUrl = "https://miraculousdeer.hu";

	/*check parameters:*/

	if (typeof ops.apikey == "string" || ops.apiKey.length != 0)
		this.apiKey = ops.apiKey;
	else
		throw "Api key is not correct";

	//NAMEDAYS
	this.namedays = {};
	
	/*
	*Return with promise within parsed json of response
	*@param {str} type type of request (todeay,tomorrow,randomtoday,randomtomorrow)
	*/
	this.namedayByType= function (type) {
		return fetch("https://www.miraculousdeer.hu/api/namedays/?type="+type+"&key="+this.apiKey, {
			"mode": "cors"
		})
		.then(function (res) {
			return res.json();
		}).then(function (json) {
			return JSON.parse(json);
		});
	}
	
	//handy shorthands for this.namedayByType() :)
	this.namedayToday=()=>this.namedayByType('today');
	
	this.namedayRandomToday=()=>this.namedayByType('randomtoday');
	
	this.namedayTomorrow=()=>this.namedayByType('tomorrow');
	
	this.namedayRandomTomorrow=()=>this.namedayByType('randomtomorrow');
	
	//zipcode getters
	
	//zipcode (3 field as parameter)
	

	//form submit handler

};

/*Eyample:*/

let form = new MiracuolusDeer({
		apiKey: "DEMO"
	});
