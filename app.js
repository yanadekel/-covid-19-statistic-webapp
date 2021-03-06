const covidBaseEndpoint = `https://corona-api.com/countries`;
const countryBaseEndpoint = `https://restcountries.herokuapp.com/api/v1`;
const countryProxy = 'https://api.allorigins.win/raw?url';
const continentChart = document.querySelector('#continentChart');
const myChart = document.querySelector('#myChart');
const countryChart = document.querySelector('#countryChart');
const Confirmed = document.querySelector('#Confirmed');
const Deaths = document.querySelector('#Deaths');
const recovered = document.querySelector('#recovered');
const critical = document.querySelector('#critical');
const new_cases = document.querySelector('#new-cases');
const total_cases = document.querySelector('#total-cases');
const total_deaths = document.querySelector('#total-deaths');
const new_deaths = document.querySelector('#new-deaths');
const total_recovered = document.querySelector('#total-recovered');
const critical_condition = document.querySelector('#critical-condition');
const option = document.querySelector('.option');
const btn = document.querySelector('.btn');
const worldBtn = document.querySelector('#buttons')




////////////////// Display Variables ////////////////
let CovidChartRegion;
let covidCountryObj = ['test'];
let NewCountryCovidData = ['test'];
let Lables = []
let Values = {
  Confirmed: [],
  Deaths: [],
  Recovered: [],
  Critical: []
}

let clearData = () => {
  console.log('Function Call: Clear Variable Data')
  covidCountryObj = [];
  NewCountryCovidData = [];
  Lables = []
  Values = {
    Confirmed: [],
    Deaths: [],
    Recovered: [],
    Critical: []
  }
}

let clickState = {
  Region: 'world',
  dataType: ''
}

googleMapValues = [['Country', 'Values']]



//////////////////  Examples of data points received by API //////////////////
const ExampleCountryAPIData = {
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
const ExampleCovidAPIData = {
  code: "AF",
  coordinates: { latitude: 33, longitude: 65 },
  population: 29121286,
  confirmed: 0,
  deaths: 0,

}

//////////////////  Display Data //////////////////

//!!! function that creates chart || Receives ValueArray, LableArray, Options

// var myBarChart = new Chart(ctx, {
//   type: 'bar',
//   data: 'data',
//   options: 'options'
// });

// Google Chart - Heat map
// google.charts.load('current', {
//   'packages': ['geochart'],
//   'mapsApiKey': 'AIzaSyAWBmU_fCYVJZ4u-2xxwdSWs6BVXr1Tfbk'
// });
// google.charts.setOnLoadCallback(drawRegionsMap);

// function drawRegionsMap() {
//   var data = google.visualization.arrayToDataTable(googleMapValues);
//   var options = {};
//   var chart = new google.visualization.GeoChart(document.getElementById('canvas'));
//   chart.draw(data, options);
// }


/// Chart.js 
CreateChart = (a) => {
  console.log("Function Call: Create Chart")
  const ctx = continentChart;
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
      labels: Lables,
      datasets: [{
        label: [`${clickState.dataType} for ${clickState.Region}`],
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: Values[clickState.dataType]
      }]
    },
    // Configuration options go here
    options: {}
    
  });
  return chart;
};



//////////////////  Get data from APIs //////////////////

// Function receives URL and returns data after json recovery
const getAPIData = async (ulr) => {
  const response = await fetch(ulr);
  if (response.status !== 200) {
    throw new Error("Data not available in DS ")
  }
  return await response.json();
}

//get covid information by contry code
const getCovidData = async (Code) => {
  let request = `https://corona-api.com/countries/${Code}`
  return await getAPIData(request)
}

// get country name and key-add pull data with all countries+
const getContinent = async (continent = undefined) => {
  const base = `${countryProxy}=https://restcountries.herokuapp.com/api/v1/`;
  let query = base;
  if (continent !== undefined) {
    query = `${base}region/${continent}`;
  }
  return await getAPIData(query);
}




// sort API data into variables for display || receives list of cca2 codes and returns/updates display variables 
//!!! async function??? calling this function requires a .then before
const extractData = (x) => {
  console.log("Function Call: Extract Data");
  covidCountryObj.push(
    {
      name: x.data.name,
      Confirmed: x.data.latest_data.confirmed,
      Deaths: x.data.latest_data.deaths,
      Recovered: x.data.latest_data.recovered,
      Critical: x.data.latest_data.critical
    });

  Lables.push(x.data.name);
  Values.Confirmed.push(x.data.latest_data.confirmed);
  Values.Deaths.push(x.data.latest_data.deaths);
  Values.Recovered.push(x.data.latest_data.recovered);
  Values.Critical.push(x.data.latest_data.critical);
  googleMapValues.push([x.data.name, x.data.latest_data.confirmed]);
}



//////////////////  Interface with User  //////////////////


setDataType = (evt)=>{
  let e = document.querySelector(".dropdowen");
  clickState.dataType = evt.target.id;
  clickState.Region = e.value;
  console.log(clickState.dataType, clickState.Region)
  applicationEngine();
}
// get user input type of data : in html there are buttons for number of cases, deaths, recoveries, etc
worldBtn.addEventListener('click', setDataType, false);

function applicationEngine() {
  console.log("Function Call: applicationEngine");
  //// Get country list for region requested by user
  let userRegionRequest = clickState.Region;
  if (userRegionRequest === 'World') {
    ////// call function that gets list of codes for all countries
    region = undefined;
  } else { region = userRegionRequest };
  console.log("Function Call: applicationEngine; region: " + region);
  ////// call function that gets list of codes for the chosen continent
  getContinent(region)
    .then(data => {
      console.log('Function Call: map cca2')
      return data.map(element => element.cca2);
    })
    .then(data => {
      console.log('Function Call: map getCovidData')
      clearData();
      // Get covid data for each country in list and update display variables
      return data.map(el => getCovidData(el).then(d => {
        extractData(d)
      }))
    })
    .then((a) => {
      // drawRegionsMap('myChart');
     
      return CreateChart(a);
     
    })

  }
  


//// call function that for each country returns the Covid stats

//// function that creates chart if the user requests data for a single country