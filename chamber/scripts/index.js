// scripts/index.js

// Function to update current year and last modified date - keep this if it's in your main.js, otherwise add it here
document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('currentyear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }
});


// Weather API Integration
const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
const WEATHER_CITY = 'Ejisu'; // Example city for the chamber location
const WEATHER_COUNTRY_CODE = 'GH'; // Country code for Ghana
const WEATHER_UNITS = 'metric'; // Use 'imperial' for Fahrenheit, 'metric' for Celsius

const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;

async function getWeatherData() {
    try {
        // Fetch current weather
        const currentResponse = await fetch(currentWeatherUrl);
        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        // Fetch 3-day forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('current-temp').textContent = 'N/A';
        document.getElementById('weather-desc').textContent = 'Failed to load weather.';
        document.getElementById('forecast-display').innerHTML = '<p>Failed to load forecast.</p>';
    }
}

function displayCurrentWeather(data) {
    if (data.main && data.weather && data.weather.length > 0) {
        const temp = data.main.temp.toFixed(1);
        const desc = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        document.getElementById('current-temp').textContent = temp;
        document.getElementById('weather-desc').textContent = capitalizeFirstLetter(desc);
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.src = iconUrl;
        weatherIcon.alt = desc;
        weatherIcon.style.display = 'inline-block'; // Show the icon
    } else {
        console.warn('Incomplete current weather data:', data);
        document.getElementById('current-temp').textContent = 'N/A';
        document.getElementById('weather-desc').textContent = 'Data incomplete.';
    }
}

function displayForecast(data) {
    const forecastDisplay = document.getElementById('forecast-display');
    forecastDisplay.innerHTML = ''; // Clear previous forecast

    if (data.list) {
        // OpenWeatherMap provides forecast data every 3 hours.
        // We need to pick one entry per day for the next 3 days.
        const dailyForecasts = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000); // Convert timestamp to Date object
            date.setHours(0, 0, 0, 0); // Set to start of the day for comparison

            if (date > today && Object.keys(dailyForecasts).length < 3) {
                const dateString = date.toISOString().split('T')[0];
                if (!dailyForecasts[dateString]) {
                    // Pick the forecast around midday (12:00 PM) for better representation
                    // Or simply the first entry for that day if exact time is not crucial
                    dailyForecasts[dateString] = item;
                }
            }
        });

        Object.values(dailyForecasts).forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = item.main.temp.toFixed(0);
            const desc = item.weather[0].description;
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            const forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-day');
            forecastCard.innerHTML = `
                <p>${day}</p>
                <img src="${iconUrl}" alt="${desc}">
                <p>${temp}&deg;C</p>
                <p>${capitalizeFirstLetter(desc)}</p>
            `;
            forecastDisplay.appendChild(forecastCard);
        });
    } else {
        console.warn('Incomplete forecast data:', data);
        forecastDisplay.innerHTML = '<p>Forecast data not available.</p>';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Call the weather function when the page loads
getWeatherData();


// Member Spotlights Integration
const MEMBERS_DATA_URL = '/wdd231/chamber/data/members.json'; // Assuming your JSON data is here

async function getMemberSpotlights() {
    try {
        const response = await fetch(MEMBERS_DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();
        displaySpotlights(members.companies); // Assuming your JSON has a 'companies' array
    } catch (error) {
        console.error('Error fetching member data:', error);
        document.getElementById('spotlights-display').innerHTML = '<p>Failed to load member spotlights.</p>';
    }
}

function displaySpotlights(companies) {
    const spotlightDisplay = document.getElementById('spotlights-display');
    spotlightDisplay.innerHTML = ''; // Clear previous spotlights

    const goldSilverMembers = companies.filter(member =>
        member.membershipLevel === 'Gold' || member.membershipLevel === 'Silver'
    );

    // Shuffle the array to get random members
    const shuffledMembers = goldSilverMembers.sort(() => 0.5 - Math.random());

    // Select 2 or 3 members
    const selectedMembers = shuffledMembers.slice(0, Math.floor(Math.random() * 2) + 2); // Randomly 2 or 3

    selectedMembers.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('spotlight-card');

        card.innerHTML = `
            ${member.logo ? `<img src="${member.logo}" alt="${member.name} Logo" loading="lazy">` : ''}
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <p><a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a></p>
            <p>Membership: ${member.membershipLevel}</p>
        `;
        spotlightDisplay.appendChild(card);
    });
}

// Call the spotlights function when the page loads
getMemberSpotlights();