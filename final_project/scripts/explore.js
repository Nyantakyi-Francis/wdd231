// explore.js - This script manages the display of anime and character lists, including a modal dialog.

// Import the setCurrentYear function from the main.js module.
import { setCurrentYear } from './main.js';

let allAnimeData = [];
let allCharacterData = [];

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
 * Renders a list of items (anime or characters) to a specified container.
 * @param {Array<Object>} items - The list of items to render.
 * @param {HTMLElement} containerElement - The DOM element to render the items into.
 * @param {string} type - 'anime' or 'character' to determine card structure and modal content.
 */
function renderItems(items, containerElement, type) {
    if (!containerElement) return;

    containerElement.innerHTML = ''; // Clear existing content

    if (!items || items.length === 0) {
        containerElement.innerHTML = `<p style="text-align: center; font-style: italic; width: 100%;">No ${type} data available.</p>`;
        return;
    }

    items.forEach(item => {
        let cardHtml = '';
        if (type === 'anime') {
            cardHtml = `
                <div class="grid-item" data-id="${item.id}" data-type="anime">
                    <img src="${item.image}" alt="Poster for ${item.title}" loading="lazy">
                    <div class="grid-item-content">
                        <h3>${item.title}</h3>
                        <p><strong>Genre:</strong> ${item.genre}</p>
                        <p><strong>Year:</strong> ${item.year}</p>
                        <p class="description">${item.description}</p>
                    </div>
                </div>
            `;
        } else if (type === 'character') {
            cardHtml = `
                <div class="grid-item" data-id="${item.id}" data-type="character">
                    <img src="${item.image}" alt="Image of ${item.name}" loading="lazy">
                    <div class="grid-item-content">
                        <h3>${item.name}</h3>
                        <p><strong>From:</strong> ${item.animeTitle}</p>
                        <p><strong>Studio:</strong> ${item.studio}</p>
                        <p class="description">${item.description}</p>
                    </div>
                </div>
            `;
        }
        containerElement.innerHTML += cardHtml;
    });

    // Add click listeners to each grid item to open the modal
    containerElement.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => openDetailModal(item.dataset.id, item.dataset.type));
    });
}

/**
 * Opens the modal dialog with detailed information about an item.
 * @param {string} id - The ID of the item.
 * @param {string} type - The type of item ('anime' or 'character').
 */
function openDetailModal(id, type) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalGenre = document.getElementById('modal-genre');
    const modalYear = document.getElementById('modal-year');
    const modalStudio = document.getElementById('modal-studio');
    const modalDescription = document.getElementById('modal-description');

    let item = null;
    if (type === 'anime') {
        item = allAnimeData.find(a => a.id == id);
    } else if (type === 'character') {
        item = allCharacterData.find(c => c.id == id);
    }

    if (item) {
        modalTitle.textContent = item.title || item.name;
        modalDescription.textContent = item.description;

        // Clear previous content
        modalGenre.style.display = 'none';
        modalYear.style.display = 'none';
        modalStudio.style.display = 'none';

        if (type === 'anime') {
            modalGenre.textContent = `Genre: ${item.genre}`;
            modalYear.textContent = `Year: ${item.year}`;
            modalGenre.style.display = 'block';
            modalYear.style.display = 'block';
        } else if (type === 'character') {
            modalGenre.textContent = `From: ${item.animeTitle}`; // Re-using genre for animeTitle
            modalStudio.textContent = `Studio: ${item.studio}`;
            modalGenre.style.display = 'block';
            modalStudio.style.display = 'block';
        }
        
        modal.style.display = 'flex'; // Show modal
    }
}

/**
 * Closes the modal dialog.
 */
function closeDetailModal() {
    const modal = document.getElementById('detail-modal');
    modal.style.display = 'none';
}

// Event listeners for showing/hiding content sections
document.addEventListener('DOMContentLoaded', async () => {
    setCurrentYear(); // Set the current year in the footer

    const showAnimeBtn = document.getElementById('show-anime-btn');
    const showCharactersBtn = document.getElementById('show-characters-btn');
    const animeSection = document.getElementById('anime-section');
    const characterSection = document.getElementById('character-section');
    const animeListContainer = document.getElementById('anime-list');
    const characterListContainer = document.getElementById('character-list');
    const closeBtn = document.querySelector('.close-btn');
    const detailModal = document.getElementById('detail-modal');


    const data = await fetchData();
    if (data) {
        allAnimeData = data.animeList;
        allCharacterData = data.characters;

        // Initially render anime list
        renderItems(allAnimeData, animeListContainer, 'anime');
        showAnimeBtn.classList.add('btn-primary');
        showCharactersBtn.classList.remove('btn-primary');
        showCharactersBtn.classList.add('btn-secondary');


        // Event listeners for buttons
        showAnimeBtn.addEventListener('click', () => {
            animeSection.style.display = 'block';
            characterSection.style.display = 'none';
            showAnimeBtn.classList.add('btn-primary');
            showAnimeBtn.classList.remove('btn-secondary');
            showCharactersBtn.classList.remove('btn-primary');
            showCharactersBtn.classList.add('btn-secondary');
            renderItems(allAnimeData, animeListContainer, 'anime'); // Re-render to ensure click handlers are fresh
        });

        showCharactersBtn.addEventListener('click', () => {
            animeSection.style.display = 'none';
            characterSection.style.display = 'block';
            showCharactersBtn.classList.add('btn-primary');
            showCharactersBtn.classList.remove('btn-secondary');
            showAnimeBtn.classList.remove('btn-primary');
            showAnimeBtn.classList.add('btn-secondary');
            renderItems(allCharacterData, characterListContainer, 'character'); // Re-render to ensure click handlers are fresh
        });

        // Event listener for closing modal
        closeBtn.addEventListener('click', closeDetailModal);
        detailModal.addEventListener('click', (event) => {
            if (event.target === detailModal) {
                closeDetailModal();
            }
        });

        // Handle URL hash for direct linking (e.g., explore.html#characters)
        if (window.location.hash === '#characters') {
            showCharactersBtn.click(); // Simulate click to show characters
        } else {
            showAnimeBtn.click(); // Default to anime
        }
    }
});
