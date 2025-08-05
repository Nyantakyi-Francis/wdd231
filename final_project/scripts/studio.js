// studio.js - This script fetches and displays a random studio from the local data file.

// Import the setCurrentYear function from the main.js module.
import { setCurrentYear } from './main.js';

/**
 * Renders the studio information on the page.
 * @param {Object} studio - The studio object to render.
 */
function renderStudio(studio) {
    const studioContent = document.getElementById('studio-content');
    if (!studioContent) return;

    // Use a template literal to create the HTML for the studio information.
    studioContent.innerHTML = `
        <div class="grid-item form-card" style="text-align: left;">
            <div class="grid-item-content">
                <h3>${studio.name}</h3>
                <p><strong>Notable Works:</strong> ${studio.notableWorks.join(', ')}</p>
                <p class="description"><strong>Description:</strong> ${studio.description}</p>
            </div>
        </div>
    `;
}

/**
 * Main function to fetch and display the studio.
 */
async function loadStudioContent() {
    const studioContent = document.getElementById('studio-content');
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Select a random studio from the list.
        const studios = data.studios;
        if (studios.length > 0) {
            const randomIndex = Math.floor(Math.random() * studios.length);
            const randomStudio = studios[randomIndex];
            
            // Render the studio.
            renderStudio(randomStudio);

        } else {
            studioContent.innerHTML = `<p style="text-align: center; font-style: italic;">No studio data available.</p>`;
        }
    } catch (error) {
        console.error('Failed to load studio data:', error);
        studioContent.innerHTML = `<p style="text-align: center; color: red;">Failed to load studio data. Please try again later.</p>`;
    }
}

// Ensure the DOM is fully loaded before running the script.
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to load the studio content.
    loadStudioContent();
    // Also, call the function to set the current year in the footer.
    setCurrentYear();
});
