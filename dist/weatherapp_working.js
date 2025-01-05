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

let userCity, userCountry;
const urlCity = `https://countriesnow.space/api/v0.1/countries`;
let apiWeather = "1a1753ecd19f5a603e66bcbe87011cf6";
const apiTime = "4YBL3IR63RQH";
let timeZones = " ";
let isServiceConnected = false;
let isCity = false;

function getCityName() {
    return new Promise((resolve, reject) => {
        fetch(urlCity)
            .then(response => response.json())
            .then(datas => {
                let countries = datas.data;
                countries.forEach(country => {
                    cities_array = country.cities;
                    cities_array.forEach(city => {
                        if ((country.country === userCountry) && city === userCity) {
                            isCity = true;
                        }
                    });
                });
                if (isCity) {
                    resolve(`City Found!`);
                } else {
                    reject(`City not found. Please try again.`);
                }
            });
    });
}

function connectionState() {
    return new Promise((resolve, reject) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiWeather}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    reject(`Error: ${response.status} - ${response.statusText}`);
                } else {
                    isServiceConnected = true;
                    resolve("Connected to the weather service.");
                }
            })
            .catch(error => reject(`Network error: ${error.message}`));
    });
}

function fetchTimeZones(latitude, longitude) {
    return new Promise((resolve, reject) => {
        let apiTimeUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiTime}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
        fetch(apiTimeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === "FAILED") {
                    reject(`Could not fetch the timezone.`);
                } else {
                    resolve(data.zoneName);
                }
            });
    });
}

function responseData() {
    return new Promise((resolve, reject) => {
        if (isServiceConnected) {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiWeather}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let longitude = data.coord.lon;
                    let latitude = data.coord.lat;
                    fetchTimeZones(latitude, longitude)
                        .then(value => {
                            timeZones = value;
                            let weatherInfo = data.weather[0].description;
                            let temperatureInfo = (data.main.temp - 273.15).toFixed(2);
                            let minTemperatureInfo = (data.main.temp_min - 273.15).toFixed(2);
                            let maxTemperatureInfo = (data.main.temp_max - 273.15).toFixed(2);
                            let pressureInfo = data.main.pressure;
                            let humidityInfo = data.main.humidity;
                            let sunriseUnix = data.sys.sunrise;
                            let sunsetUnix = data.sys.sunset;
                            let sunriseInfo = new Date(sunriseUnix * 1000).toLocaleTimeString(`en-${userCountry}`, { timeZone: timeZones });
                            let sunsetInfo = new Date(sunsetUnix * 1000).toLocaleTimeString(`en-${userCountry}`, { timeZone: timeZones });

                            resolve(`
                                The longitude is ${longitude}.
                                The latitude is ${latitude}.
                                The weather in ${userCity} is ${weatherInfo}.
                                The temperature is ${temperatureInfo}°C.
                                The minimum temperature is ${minTemperatureInfo}°C.
                                The maximum temperature is ${maxTemperatureInfo}°C.
                                The pressure is ${pressureInfo} hPa.
                                The humidity is ${humidityInfo}%.
                                The sun rises at ${sunriseInfo}.
                                The sun sets at ${sunsetInfo}.
                            `);
                        })
                        .catch(error => reject(error));
                })
                .catch(error => reject(`Error fetching weather data: ${error.message}`));
        }
    });
}

submitBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    userCity = inputCity.value.trim();
    userCountry = inputCountry.value.trim();

    if (userCity === "" || userCountry === "") {
        alert("Please enter both city and country.");
        return;
    }

    main();
});

async function main() {
    try {
        let cityResult = await getCityName();
        document.querySelector("#statusArea").innerText = cityResult;

        let connectionResult = await connectionState();
        document.querySelector("#statusArea").innerText = connectionResult;

        let responsesResult = await responseData();
        document.querySelector("#weatherArea").innerText = responsesResult;

    } catch (e) {
        console.error(e);
        document.querySelector("#statusArea").innerText = `${e}`;
    }
}
