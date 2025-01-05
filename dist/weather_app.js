const submitBtn = document.querySelector("#submit");
const inputCity = document.querySelector("#city");
const inputCountry = document.querySelector("#country");
let userInputCountry , userCountry , userInputCity , userCity;
const urlCity = `https://countriesnow.space/api/v0.1/countries`;
let apiWeather = "1a1753ecd19f5a603e66bcbe87011cf6";
const apiTime = "4YBL3IR63RQH";
let timeZones = " ";
let countryCode = null;
let countryName = null;
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

                        const weatherOptions = {
                            Temperature: `${temperatureInfo}°C`,
                            MinimumTemperature: `${minTemperatureInfo}°C`,
                            MaximumTemperature: `${maxTemperatureInfo}°C`,
                            Pressure: `${pressureInfo} hPa`,
                            Humidity: `${humidityInfo}%`,
                            Sunrise: `${sunriseInfo}`,
                            Sunset: `${sunsetInfo}`,
                            weather: weatherInfo,
                            longitude: longitude,
                            latitude: latitude
                        };
                        resolve(weatherOptions);
                    }).catch(error => reject(error));
                }).catch(error => reject(error));
        }
    });
}

const area = document.querySelector("#statusArea");
function options(weatherOptions){
    let option_area = [ 'Temperature', 'MinimumTemperature', 'MaximumTemperature', 'Pressure', 'Humidity', 'Sunrise', 'Sunset'];
     for (let i = 0 ; i< option_area.length; i++){
         let optionLabel = option_area[i];
         let optionElement  = document.createElement("p");
            optionElement.innerText = `${userCity}'s   ${optionLabel}: `;
            let tempBtn = document.createElement("button");
            tempBtn.innerText = "Get";
            tempBtn.classList.add("bg-blue-500", "text-white", "p-1", "rounded-lg", "hover:bg-blue-700", "m-1");
            optionElement.appendChild(tempBtn);
            optionElement.classList.add("text-lg", "font-medium","mr-1","text-sm","block");
            area.appendChild(optionElement);
            tempBtn.addEventListener("click", ()=>{
                let value = weatherOptions[optionLabel];
                optionElement.innerText = `${userCity}'s ${optionLabel}: ${value}`;
            });
     }
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
        document.querySelector("#statusArea").innerText = `
                               Weather Forcast of ${userCity} in ${userCountry} 
         
                                The weather in ${userCity} is ${responsesResult.weather}.`

        await options(responsesResult);
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