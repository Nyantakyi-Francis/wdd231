// character.js - This script fetches character data from a local JSON file and renders it on the page.

// Import the setCurrentYear function from the main.js module.
import { setCurrentYear } from './main.js';

/**
 * Fetches data from the local JSON file and processes it.
 * It uses an asynchronous function with a try...catch block for robust error handling.
 */
async function fetchCharacterData() {
    try {
        // Use the Fetch API to retrieve the data from the local 'data.json' file.
        const response = await fetch('data/data.json');

        // Check if the response was successful.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response into a JavaScript object.
        const data = await response.json();
        
        // Render the character list to the DOM.
        renderCharacterList(data.characters);

    } catch (error) {
        // Log any errors that occurred during the fetch or parsing process.
        console.error('Failed to fetch character data:', error);
        
        // Display a user-friendly error message on the page.
        const listElement = document.getElementById('character-list');
        if (listElement) {
            listElement.innerHTML = `<p style="text-align: center; color: red;">Failed to load character data. Please try again later.</p>`;
        }
    }
}

/**
 * Renders the list of characters on the page.
 * @param {Array<Object>} characterList - An array of character objects.
 */
function renderCharacterList(characterList) {
    // Get the container element where the character cards will be displayed.
    const listElement = document.getElementById('character-list');

    // Clear any existing content.
    listElement.innerHTML = '';
    
    // Check if there is data to display.
    if (!characterList || characterList.length === 0) {
        listElement.innerHTML = `<p style="text-align: center; font-style: italic;">No character data available.</p>`;
        return;
    }

    // Use the forEach array method to iterate over each character object.
    characterList.forEach(character => {
        // Use a template literal to create the HTML for a character card.
        const characterCard = `
            <div class="grid-item">
                <img src="${character.image}" alt="Image of ${character.name}" loading="lazy">
                <div class="grid-item-content">
                    <h3>${character.name}</h3>
                    <p><strong>From:</strong> ${character.animeTitle}</p>
                    <p><strong>Studio:</strong> ${character.studio}</p>
                    <p class="description">${character.description}</p>
                </div>
            </div>
        `;
        
        // Append the new card to the list container.
        listElement.innerHTML += characterCard;
    });
}

// Ensure the DOM is fully loaded before running the script.
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to fetch and render the character data.
    fetchCharacterData();
    // Also, call the function to set the current year in the footer.
    setCurrentYear();
});
