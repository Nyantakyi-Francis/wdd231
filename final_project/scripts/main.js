// main.js - This script contains the main logic for the home page, including featured content.

/**
 * Sets the current year in the footer of the page.
 * This is a simple DOM manipulation task to meet project requirements.
 */
export function setCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
}

/**
 * Fetches data from the local JSON file.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 */
async function fetchData() {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        // console.error('Failed to fetch data:', error); // Removed console.error
        return null; // Return null on error
    }
}

/**
 * Renders a limited number of featured items (anime or characters) to a specified container.
 * @param {Array<Object>} items - The list of items (anime or characters) to choose from.
 * @param {HTMLElement} containerElement - The DOM element to render the items into.
 * @param {number} limit - The maximum number of items to display.
 * @param {string} type - 'anime' or 'character' to determine card structure.
 */
function renderFeaturedItems(items, containerElement, limit, type) {
    if (!containerElement) return;

    containerElement.innerHTML = ''; // Clear existing content

    if (!items || items.length === 0) {
        containerElement.innerHTML = `<p style="text-align: center; font-style: italic; width: 100%;">No ${type} data available.</p>`;
        return;
    }

    // Shuffle items and take a limited number
    const shuffledItems = items.sort(() => 0.5 - Math.random());
    const featured = shuffledItems.slice(0, limit);

    featured.forEach(item => {
        let cardHtml = '';
        if (type === 'anime') {
            cardHtml = `
                <div class="grid-item">
                    <img src="${item.image}" alt="Poster for ${item.title}" loading="lazy">
                    <div class="grid-item-content">
                        <h3>${item.title}</h3>
                        <p><strong>Genre:</strong> ${item.genre}</p>
                        <p><strong>Year:</strong> ${item.year}</p>
                    </div>
                </div>
            `;
        } else if (type === 'character') {
            cardHtml = `
                <div class="grid-item">
                    <img src="${item.image}" alt="Image of ${item.name}" loading="lazy">
                    <div class="grid-item-content">
                        <h3>${item.name}</h3>
                        <p><strong>From:</strong> ${item.animeTitle}</p>
                        <p><strong>Studio:</strong> ${item.studio}</p>
                    </div>
                </div>
            `;
        }
        containerElement.innerHTML += cardHtml;
    });
}

// Initialize the home page content
document.addEventListener('DOMContentLoaded', async () => {
    setCurrentYear(); // Set the current year in the footer

    const data = await fetchData();
    if (data) {
        const featuredAnimeContainer = document.getElementById('featured-anime-list');
        const featuredCharacterContainer = document.getElementById('featured-character-list');

        renderFeaturedItems(data.animeList, featuredAnimeContainer, 6, 'anime'); // Display 6 featured anime
        renderFeaturedItems(data.characters, featuredCharacterContainer, 6, 'character'); // Display 6 featured characters
    }
});
