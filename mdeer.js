const MiracuolusDeer = function (ops) {
	//CHECK APIKEY

	if (typeof ops.apikey == "string" || ops.apiKey.length != 0)
		this.apiKey = ops.apiKey;
	else
		throw "Api key is not correct";
};

//******************
//******NAMEDAYS
//******************

/*
 *Return with promise within parsed json of response
 *@param {str} type type of request (todeay,tomorrow,randomtoday,randomtomorrow)
 */

MiracuolusDeer.prototype.namedayByType = function (type) {
	return fetch("https://www.miraculousdeer.hu/api/namedays/?type=" + type + "&key=" + this.apiKey, {
		"mode": "cors"
	})
	.then(function (res) {
		return res.json();
	}).then(function (json) {
		return JSON.parse(json);
	});
};

MiracuolusDeer.prototype.namedayToday = () => MiracuolusDeer.prototype.namedayByType('today');
MiracuolusDeer.prototype.namedayRandomToday = () => MiracuolusDeer.prototype.namedayByType('randomtoday');
MiracuolusDeer.prototype.namedayTomorrow = () => MiracuolusDeer.prototype.namedayByType('tomorrow');
MiracuolusDeer.prototype.namedayRandomTomorrow = () => MiracuolusDeer.prototype.namedayByType('randomtomorrow');

//******************
//******DESTINATION
//******************


/*
EG: get zipcode and county based on city
@param {str} type (county/city/code)
@param {str} val Value of county(e.g Szeged or Pest)
 */
MiracuolusDeer.prototype.destinationByType = function (type, val) {
	return fetch("https://www.miraculousdeer.hu/api/zipcode/?" + type + "=" + val + "&key=" + this.apiKey, {
		"mode": "cors"
	})
	.then(function (res) {
		return res.json();
	});
};

MiracuolusDeer.prototype.destinationByCity = (city) => MiracuolusDeer.prototype.destinationByType('city', city);
MiracuolusDeer.prototype.destinationByCode = (code) => MiracuolusDeer.prototype.destinationByType('code', code);
MiracuolusDeer.prototype.destinationByCounty = (county) => MiracuolusDeer.prototype.destinationByType('county', county);

/*
 *Setting up 3 inputs for autocorrect values based on input text
 *@param {object} codeInput
 *@param {object} cityInput
 *@param {object} countyInput
 *@param {str} updateOn default:false, value is an event type for inputs
 */
MiracuolusDeer.prototype.destinationAutocompleteInit = function (codeInput, cityInput, countyInput, updateOn = false) {
	//chechk parameters
	if (!codeInput) {
		throw "Destination: Code input does not exists";
		return false;
	}

	if (!cityInput) {
		throw "Destination: City input does not exists";
		return false;
	}

	if (!countyInput) {
		throw "Destination: County input does not exists";
		return false;
	}

	//add datalists for every input
	function addDataListFor(inpEl) {
		//create dl element
		let newDataList = document.createElement('datalist');
		newDataList.id = "miraculous-valuelist-" + inpEl.name;
		inpEl.parentNode.insertBefore(newDataList, inpEl.nextSibling);

		//set input element attr
		inpEl.setAttribute('list', "miraculous-valuelist-" + inpEl.name);

		return newDataList;
	}

	function createOptionEl(value) {
		let newOptEl = document.createElement('option');
		newOptEl.innerText = value;
		return newOptEl;
	}

	let codeDl = addDataListFor(codeInput);
	let cityDl = addDataListFor(cityInput);
	let countyDl = addDataListFor(countyInput);

	let miracleObj = this;

	//update datalits on press keys
	function updateDatalist(type) {
		return function (e) {
			let inpEl = this;
			miracleObj.destinationByType(type, inpEl.value).then(r => {

				if (r.success && r.response.length > 0) {

					//clear datalists
					if (r.response[0].cityname)
						cityDl.innerHTML = '';

					if (r.response[0].county)
						countyDl.innerHTML = '';

					if (r.response[0].zipcode)
						codeDl.innerHTML = '';

					//update datalits from response
					r.response.forEach(function (d) {

						let isExistsInList = (val, dlEl) => [...dlEl.childNodes].filter(el => el.innerText == val).length;
						if (d.zipcode && !isExistsInList(d.zipcode, codeDl))
							codeDl.appendChild(createOptionEl(d.zipcode));

						if (d.cityname && !isExistsInList(d.cityname, cityDl))
							cityDl.appendChild(createOptionEl(d.cityname));

						if (d.county && !isExistsInList(d.county, countyDl))
							countyDl.appendChild(createOptionEl(d.county));
					});
					
					//update input if only one response destination
					if (r.response.length==1){
						if (r.response[0].zipcode)
							codeInput.value=r.response[0].zipcode;
						
						if (r.response[0].cityname)
							cityInput.value=r.response[0].cityname;
						
						if (r.response[0].county)
							countyInput.value=r.response[0].county
					}
					

				} else if (r.success == false) {
					throw r.error;
					return;
				}
			});
		}
	}

	if (updateOn) {
		codeInput.addEventListener(updateOn, updateDatalist('code'));
		cityInput.addEventListener(updateOn, updateDatalist('city'));
		countyInput.addEventListener(updateOn, updateDatalist('county'));
	}

	return updateDatalist
}

//******************
//***FORM SUBMIT HANDLING
//******************
//TODO

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*Example:*/

//init miraculousdeer
let miracle = new MiracuolusDeer({
		apiKey: "DEMO", //REQUIRED
	});

//init autocomplete
let codeElement = document.getElementById("code");
let cityElement = document.getElementById("city");
let countyElement = document.getElementById("county");
let updateFunc = miracle.destinationAutocompleteInit(codeElement, cityElement, countyElement,'focusout');
/*
codeElement.addEventListener('keyup', updateFunc('code'));
cityElement.addEventListener('keyup', updateFunc('city'));
countyElement.addEventListener('keyup', updateFunc('county'));
*/