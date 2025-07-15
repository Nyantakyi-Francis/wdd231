// scripts/index.js

// Define the base URL for your GitHub Pages project
// This ensures paths are always correct regardless of where the script is located
const GITHUB_PAGES_BASE_URL = 'https://nyantakyi-francis.github.io/wdd231/';

// Function to update current year and last modified date
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
const WEATHER_API_KEY = '360debc3d41e2cdd47518becd29d2f04'; 
const WEATHER_CITY = 'Ejisu'; // City for the chamber location
const WEATHER_COUNTRY_CODE = 'GH'; // Country code for Ghana
const WEATHER_UNITS = 'metric'; 

const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CITY},${WEATHER_COUNTRY_CODE}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;

async function getWeatherData() {
    try {
        // Fetch current weather
        const currentResponse = await fetch(currentWeatherUrl);
        const currentData = await currentResponse.json();
        // Check for API errors before displaying
        if (currentData.cod && currentData.cod !== 200) {
            console.error('OpenWeatherMap Current Weather API Error:', currentData.message);
            document.getElementById('current-temp').textContent = 'N/A';
            document.getElementById('weather-desc').textContent = `Error: ${currentData.message}`;
        } else {
            displayCurrentWeather(currentData);
        }


        // Fetch 3-day forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        // Check for API errors before displaying
        if (forecastData.cod && forecastData.cod !== '200') { // forecast cod is a string
            console.error('OpenWeatherMap Forecast API Error:', forecastData.message);
            document.getElementById('forecast-display').innerHTML = '<p>Failed to load forecast.</p>';
        } else {
            displayForecast(forecastData);
        }

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
        const dailyForecasts = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000); // Convert timestamp to Date object
            date.setHours(0, 0, 0, 0); // Set to start of the day for comparison

            // Only consider future days, up to 3 distinct days
            if (date > today && Object.keys(dailyForecasts).length < 3) {
                const dateString = date.toISOString().split('T')[0];
                // Prioritize a forecast around midday (12-15 PM) for each day if available
                if (!dailyForecasts[dateString] || (date.getHours() >= 12 && date.getHours() < 15)) {
                    dailyForecasts[dateString] = item;
                }
            }
        });

        // Ensure we have exactly 3 days if possible, by filling in earliest entries if midday not found
        const sortedKeys = Object.keys(dailyForecasts).sort();
        const finalForecasts = [];
        for(let i = 0; i < 3; i++) {
            if(sortedKeys[i]) {
                finalForecasts.push(dailyForecasts[sortedKeys[i]]);
            }
        }


        finalForecasts.forEach(item => {
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
// Path is correct based on your structure: chamber/data/members.json
const MEMBERS_DATA_URL = 'data/members.json'; 

async function getMemberSpotlights() {
    try {
        const response = await fetch(MEMBERS_DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // No .companies property needed, as the JSON is a direct array
        const members = await response.json(); 
        displaySpotlights(members); 
    } catch (error) {
        console.error('Error fetching member data:', error);
        document.getElementById('spotlights-display').innerHTML = '<p>Failed to load member spotlights.</p>';
    }
}

// Renamed parameter to 'companies' for clarity, even though it's now a direct array
function displaySpotlights(companies) { 
    const spotlightDisplay = document.getElementById('spotlights-display');
    spotlightDisplay.innerHTML = ''; // Clear previous spotlights

    // Filter for membershiplevel 2 (Silver) or 3 (Gold) as per your JSON
    const goldSilverMembers = companies.filter(member =>
        member.membershiplevel === 2 || member.membershiplevel === 3 
    );

    // Shuffle the array to get random members
    const shuffledMembers = goldSilverMembers.sort(() => 0.5 - Math.random());

    // Select 2 or 3 members randomly
    const selectedMembers = shuffledMembers.slice(0, Math.floor(Math.random() * 2) + 2); 

    selectedMembers.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('spotlight-card');

        // Use 'imagefilename' for logo and 'websiteurl' for website
        // !!! IMPORTANT: Updated image path to use GITHUB_PAGES_BASE_URL for absolute path !!!
        card.innerHTML = `
            ${member.imagefilename ? `<img src="${GITHUB_PAGES_BASE_URL}images/${member.imagefilename}" alt="${member.name} Logo" loading="lazy">` : ''}
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <p><a href="${member.websiteurl}" target="_blank">${member.websiteurl.replace(/(^\w+:|^)\/\//, '')}</a></p>
            <p>Membership Level: ${member.membershiplevel}</p>
        `;
        spotlightDisplay.appendChild(card);
    });
}

// Call the spotlights function when the page loads
getMemberSpotlights();