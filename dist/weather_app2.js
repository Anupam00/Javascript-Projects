const submitBtn = document.querySelector("#submit");
const inputCity = document.querySelector("#city");
const inputCountry = document.querySelector("#country");
const weather = document.querySelector("#weatherArea");
const temp = document.querySelector("#tempArea");
const minTemp = document.querySelector("#minTempArea");
const maxTemp = document.querySelector("#maxTempArea");
const pressure = document.querySelector("#pressureArea");
const humidity = document.querySelector("#humidityArea");
const sunrise = document.querySelector("#sunriseArea");
const sunset = document.querySelector("#sunsetArea");
const status = document.querySelector("#statusArea");


let userInputCountry , userCountry , userInputCity , userCity;
let countryCode = null;
let countryName = null;
const urlCity = `https://countriesnow.space/api/v0.1/countries`;
let apiWeather = "1a1753ecd19f5a603e66bcbe87011cf6";
const apiTime = "4YBL3IR63RQH";
let timeZones = " ";
let isServiceConnected = false;
let isCity = false;


function getCityName(){
    return new Promise((resolve,reject)=>{
        let countryCode = null;
        let countryName = null;
        let isCity = false;
        fetch(urlCity)
            .then(response => response.json())
            .then(datas => {
                let countries = datas.data;
                countries.forEach(country => {
                    cities_array = country.cities;
                    cities_array.forEach(city => {
                        if ((country.country === userCountry) && (city === userCity)) {
                            isCity = true;
                            countryCode = country.iso2;
                            countryName = country.country;

                        }
                    });
                });
            })
            .then(()=>{
                if(isCity){
                    resolve(
                        `
                               City ${userCity} Found !
                               The city is from ${countryName}`);
                }
                else{
                    reject(`City not found. Please Try Again.`);
                }
            }).catch(error=> reject())
    });
}


function connectionState() {
    return new Promise((resolve, reject) => {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiWeather}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 401) {
                        console.error(`Invalid API key. Please enter the valid API key.`);
                        reject(`Service is down. Please try again later.`);

                    } else {
                        isServiceConnected = true;
                        resolve(`
                                 Connected! Fetching Data...`);
                    }
                }) .catch(error => reject(`Network error: ${error.message}`));
    });
}


function fetchTimeZones(latitude,longitude){
    return new Promise((resolve,reject)=>{
        let apiTimeUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiTime}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
        fetch(apiTimeUrl)
            .then(response => response.json())
            .then(data => {

                if (data.status === "FAILED") {
                    reject(`Error: CouldNot Fetch The TimeZone`);
                }
                else {
                    resolve(data.zoneName);
                }

            })
    });
}


function responseData(){
    return  new Promise((resolve,reject)=>{
        if(isServiceConnected){
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiWeather}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let longitude = data.coord.lon;
                    let latitude = data.coord.lat;
                    fetchTimeZones(latitude,longitude).then((value)=>{
                        timeZones = value;
                        let weatherInfo = data.weather[0].description;
                        let temperatureInfo =  ((data.main.temp)-273.15).toFixed(2);
                        let minTemperatureInfo = ((data.main.temp_min)-273.15).toFixed(2);
                        let maxTemperatureInfo = ((data.main.temp_max)-273.15).toFixed(2);
                        let pressureInfo = data.main.pressure;
                        let humidityInfo = data.main.humidity;
                        let sunriseUnix = data.sys.sunrise;
                        let sunsetUnix = data.sys.sunset;
                        let sunriseInfo =new Date(sunriseUnix * 1000).toLocaleTimeString(`en-${countryCode}`, {timeZone: `${timeZones}`});
                        let sunsetInfo = new Date(sunsetUnix * 1000).toLocaleTimeString(`en-${countryCode}`, {timeZone: `${timeZones}`});

                    resolve(`
                               Weather Forcast of ${userCity} in ${userCountry} 
                               
                            
                                The weather in ${userCity} is ${weatherInfo}.
                                The temperature is ${temperatureInfo}°C.
                                The minimum temperature is ${minTemperatureInfo}°C.
                                The maximum temperature is ${maxTemperatureInfo}°C.
                                The pressure is ${pressureInfo} hPa.
                                The humidity is ${humidityInfo}%.
                                The sun rises at ${sunriseInfo}.
                                The sun sets at ${sunsetInfo}.
                                The longitude is ${longitude}.
                                The latitude is ${latitude}.`);

                            }).catch(error => reject(error));
                }).catch(error => reject(error));
        }
    });
}


async function main() {
    try {
        let cityResult = await getCityName();

            console.log(cityResult);
            document.querySelector("#statusArea").innerText = cityResult

        let connectionResult = await connectionState();

            console.log(connectionResult);
            document.querySelector("#statusArea").innerText = connectionResult

        let responsesResult = await responseData();

            console.log(responsesResult);
            document.querySelector("#statusArea").innerText = responsesResult
    }catch (e) {
        console.error(e);
        document.querySelector("#statusArea").innerText = `${e}`;

    }
}

submitBtn.addEventListener("click", (event)=>{
    event.preventDefault()
     userInputCountry = inputCountry.value.trim().toLowerCase();
     userCountry = userInputCountry.charAt(0).toUpperCase() + userInputCountry.slice(1);
     userInputCity = inputCity.value.trim().toLowerCase();
     userCity = userInputCity.charAt(0).toUpperCase() + userInputCity.slice(1);

    if (inputCity.value === "" || inputCountry.value === "") {
        alert("Please enter the city and country");
    }
    else{
        document.querySelector("#statusArea").innerText = "Checking city and weather data...";
    }
    main();
    inputCountry.value = null;
    inputCity.value = null;
});