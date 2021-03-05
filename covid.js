const covidBaseEndpoint = `https://corona-api.com/countries`;
const countryBaseEndpoint = `https://restcountries.herokuapp.com/api/v1`;
const countryProxy = 'https://api.allorigins.win/raw?url';
const contrySemple = {
  "name": {
    "common": "Afghanistan",
    "official": "Islamic Republic of Afghanistan",
    "native": {
      "common": "افغانستان",
      "official": "د افغانستان اسلامي جمهوریت"
    }
  },
  "tld": [
    ".af"
  ],
  "region": "Asia",
  "cca2": "AF",
  "ccn3": "004",
  "cca3": "AFG",
  "currency": [
    "AFN"

  ],
}

// const covidSepel= {
// code: "AF",
// coordinates: {latitude: 33, longitude: 65},
// latest_data: {deaths: 2449, confirmed: 55933, recovered: 49362, critical: 4122, calculated: {…}},
// name: "Afghanistan",
// population: 29121286,
// confirmed: 0,
// deaths: 0,

// }


//get covid information by contry code

getCovidCountry = async (Code) => {
  const base = `https://corona-api.com/countries/${Code}`;
  const response = await fetch(base);
  const data = await response.json();
  return data;


  // return {
  //   name: x.name,
  //   Confirmed_Cases: x.confirmed,
  //   Number_of_Deaths: x.deaths,
  //   Number_of_recovered: x.recovered,
  //   Number_of_critical_condition: x.critical
  // }
}




// get country name and key-add pull data with all countries+
const getContenet = async (continent) => {
  const base = `https://restcountries.herokuapp.com/api/v1/region/`;
  const query = `${countryProxy}=${base}${continent}`;
  const response = await fetch(query);
  const data = await response.json();
  return data;


}


// get user input type of data


// get user input area : in html there are buttons for Europ, Asia, America, Africa, Australia, Antartica and All
// event listiner
// call function that gets list of codes for the chosen continent

// call function that for each country returns the Covid stats



// function that creates chart if the user requests data for a single country 


// function that creates chart || Receives ValueArray, LableArray, Options
// var myBarChart = new Chart(ctx, {
//   type: 'bar',
//   data: data,
//   options: options
// });

let covidCountryObj = [];


getContenet('asia').then(data => {
  return data.map(element => element.cca2);
}).then(data => {
  for (let i = 0; i < data.length; i++) {
    covidCountryObj.push(getCovidCountry(data[i]))
  }
  return covidCountryObj;
}).then(covidCountryObj => covidCountryObj.map(elm => elm.object))
  .then(console.log(covidCountryObj))

