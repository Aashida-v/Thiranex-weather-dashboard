// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weather-card");

const cityName = document.getElementById("city-name");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const feelsLike = document.getElementById("feels-like");
const lastUpdated = document.getElementById("last-updated");

const searchButton = searchForm.querySelector("button");
const weatherIcon = document.getElementById("weather-icon");
// =====================================
// 2. WEATHER DESCRIPTION
// =====================================

function getWeatherDescription(code) {

    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",
        80: "Rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        95: "Thunderstorm"
    };

    return weatherCodes[code] || "Weather information unavailable";
    // =====================================
// WEATHER ICON FUNCTION
// =====================================

function getWeatherIcon(code) {

    if (code === 0) return "☀️";

    if (code === 1 || code === 2) return "🌤️";

    if (code === 3) return "☁️";

    if (code === 45 || code === 48) return "🌫️";

    if (code >= 51 && code <= 55) return "🌦️";

    if (code >= 61 && code <= 65) return "🌧️";

    if (code >= 71 && code <= 75) return "❄️";

    if (code >= 80 && code <= 82) return "🌧️";

    if (code === 95) return "⛈️";

    return "🌡️";
}
}

// =====================================
// 3. FETCH WEATHER DATA
// =====================================

async function getWeather(city) {

    try {

       message.textContent = "Fetching weather data...";
message.className = "loading";
        weatherCard.hidden = true;
        searchButton.disabled = true;
        searchButton.textContent = "Loading...";

        // STEP 1: GET CITY COORDINATES

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // STEP 2: GET WEATHER DATA

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
            throw new Error("Weather data is unavailable for this location.");
        }

        // STEP 3: EXTRACT CURRENT WEATHER

        const current = weatherData.current;

        // STEP 4: DISPLAY WEATHER INFORMATION

        cityName.textContent =
            `${location.name}, ${location.country}`;

        weatherDescription.textContent =
            getWeatherDescription(current.weather_code);
        weatherIcon.textContent =
    getWeatherIcon(current.weather_code);

        temperature.textContent =
            Math.round(current.temperature_2m);

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        feelsLike.textContent =
            `${Math.round(current.apparent_temperature)}°C`;

        lastUpdated.textContent =
            `Last updated: ${current.time.replace("T", " ")}`;

        weatherCard.hidden = false;

        message.textContent = "";

    } catch (error) {

        // ERROR HANDLING

        message.textContent = error.message;
message.className = "error";

        weatherCard.hidden = true;

        console.error("Weather API Error:", error);

    } finally {

        // RESTORE SEARCH BUTTON

        searchButton.disabled = false;
        searchButton.textContent = "Search";
        message.className = "";

    }
}

// =====================================
// 4. SEARCH FORM EVENT
// =====================================

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);

});