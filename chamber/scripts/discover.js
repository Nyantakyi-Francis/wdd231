// chamber/scripts/discover.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Last Visit Message (localStorage) ---
    const lastVisitMessageElement = document.getElementById('last-visit-message');
    const lastVisit = localStorage.getItem('lastVisit'); // Get last visit timestamp from localStorage
    const now = Date.now(); // Current timestamp in milliseconds

    if (lastVisit) {
        const lastVisitDate = parseInt(lastVisit);
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const daysSinceLastVisit = Math.floor((now - lastVisitDate) / millisecondsPerDay);

        if (daysSinceLastVisit < 1) {
            lastVisitMessageElement.textContent = "Back so soon! Awesome!";
        } else if (daysSinceLastVisit === 1) {
            lastVisitMessageElement.textContent = "You last visited 1 day ago.";
        } else {
            lastVisitMessageElement.textContent = `You last visited ${daysSinceLastVisit} days ago.`;
        }
    } else {
        lastVisitMessageElement.textContent = "Welcome! Let us know if you have any questions.";
    }

    // Update last visit to current time
    localStorage.setItem('lastVisit', now.toString());


    // --- Dynamic Card Generation from JSON ---
    const cardsGrid = document.getElementById('cards-grid');
    const jsonPath = 'data/discover.json'; // Path to your JSON file

    async function getDiscoverData() {
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayDiscoverCards(data);
        } catch (error) {
            console.error('Error fetching discover data:', error);
            cardsGrid.innerHTML = '<p>Failed to load discover content. Please try again later.</p>';
        }
    }

    function displayDiscoverCards(items) {
        if (!items || items.length === 0) {
            cardsGrid.innerHTML = '<p>No discover items found.</p>';
            return;
        }

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('chamber-card');
            // Assign grid-area based on index for CSS grid-template-areas
            // Card indices are 1-based in CSS, so add 1 to JS index
            card.style.gridArea = `card${index + 1}`;

            const name = document.createElement('h2');
            name.textContent = item.name;

            const figure = document.createElement('figure');
            const image = document.createElement('img');
            image.setAttribute('src', `../images/${item.image}`); // Path to your images
            image.setAttribute('alt', item.name);
            image.setAttribute('loading', 'lazy'); // Lazy loading 
            figure.appendChild(image);

            const address = document.createElement('address');
            address.textContent = item.address;

            const description = document.createElement('p');
            description.textContent = item.description;

            const learnMoreButton = document.createElement('button');
            learnMoreButton.classList.add('learn-more-button');
            learnMoreButton.textContent = 'Learn More';
            learnMoreButton.onclick = () => window.open(item.learn_more_url, '_blank'); // Open in new tab

            card.appendChild(name);
            card.appendChild(figure);
            card.appendChild(address);
            card.appendChild(description);
            card.appendChild(learnMoreButton);

            cardsGrid.appendChild(card);
        });
    }

    // Call the function to fetch and display data
    getDiscoverData();
});

// Update current year and last modified date in footer
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;