// anime.js - This script fetches anime data from a local JSON file and renders it on the page.

// Import the setCurrentYear function from the main.js module.
import { setCurrentYear } from './main.js';

/**
 * Fetches data from the local JSON file and processes it.
 * It uses an asynchronous function with a try...catch block for robust error handling.
 */
async function fetchAnimeData() {
    try {
        // Use the Fetch API to retrieve the data from the local 'data.json' file.
        const response = await fetch('data/data.json');

        // Check if the response was successful.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response into a JavaScript object.
        const data = await response.json();
        
        // Render the anime list to the DOM.
        renderAnimeList(data.animeList);

    } catch (error) {
        // Log any errors that occurred during the fetch or parsing process.
        console.error('Failed to fetch anime data:', error);
        
        // Display a user-friendly error message on the page.
        const listElement = document.getElementById('anime-list');
        if (listElement) {
            listElement.innerHTML = `<p style="text-align: center; color: red;">Failed to load anime data. Please try again later.</p>`;
        }
    }
}

/**
 * Renders the list of anime on the page.
 * @param {Array<Object>} animeList - An array of anime objects.
 */
function renderAnimeList(animeList) {
    // Get the container element where the anime cards will be displayed.
    const listElement = document.getElementById('anime-list');

    // Clear any existing content.
    listElement.innerHTML = '';
    
    // Check if there is data to display.
    if (!animeList || animeList.length === 0) {
        listElement.innerHTML = `<p style="text-align: center; font-style: italic;">No anime data available.</p>`;
        return;
    }

    // Use the forEach array method to iterate over each anime object.
    animeList.forEach(anime => {
        // Use a template literal to create the HTML for an anime card.
        const animeCard = `
            <div class="grid-item">
                <img src="${anime.image}" alt="Poster for ${anime.title}" loading="lazy">
                <div class="grid-item-content">
                    <h3>${anime.title}</h3>
                    <p><strong>Genre:</strong> ${anime.genre}</p>
                    <p><strong>Year:</strong> ${anime.year}</p>
                    <p class="description">${anime.description}</p>
                </div>
            </div>
        `;
        
        // Append the new card to the list container.
        listElement.innerHTML += animeCard;
    });
}

// Ensure the DOM is fully loaded before running the script.
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to fetch and render the anime data.
    fetchAnimeData();
    // Also, call the function to set the current year in the footer.
    setCurrentYear();
});
