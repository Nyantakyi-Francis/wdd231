// directory.js - Handles fetching and displaying member data, and view toggling

document.addEventListener('DOMContentLoaded', () => {
    const url = '/data/members.json'; // Path to your JSON file
    const memberDisplay = document.getElementById('member-display');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');

    let membersData = []; // To store fetched data globally for toggling

    /**
     * Fetches member data from the JSON file.
     */
    async function getMemberData() {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            membersData = await response.json(); // Store data
            displayMembers(membersData, 'grid'); // Display in grid view by default
        } catch (error) {
            console.error("Error fetching member data:", error);
            memberDisplay.innerHTML = '<p class="error-message">Failed to load member data. Please try again later.</p>';
        }
    }

    /**
     * Displays member information in either grid or list view.
     * @param {Array<Object>} members - An array of member objects.
     * @param {string} viewType - 'grid' or 'list'.
     */
    const displayMembers = (members, viewType) => {
        memberDisplay.innerHTML = ''; // Clear existing content
        memberDisplay.className = ''; // Clear existing classes
        memberDisplay.classList.add(viewType === 'grid' ? 'member-grid' : 'member-list');

        members.forEach(member => {
            // Create elements for each member card/list item
            const card = document.createElement('section');
            card.classList.add('member-card');

            const name = document.createElement('h2');
            name.textContent = member.name;

            const address = document.createElement('p');
            address.textContent = member.address;

            const phone = document.createElement('p');
            phone.textContent = member.phone;

            const website = document.createElement('p');
            const websiteLink = document.createElement('a');
            websiteLink.href = member.websiteurl;
            websiteLink.textContent = member.websiteurl;
            websiteLink.target = "_blank"; // Open in new tab
            websiteLink.rel = "noopener noreferrer"; // Security best practice
            websiteLink.classList.add('website-link');
            website.appendChild(websiteLink);

            const membershipLevel = document.createElement('p');
            let levelText = '';
            switch (member.membershiplevel) {
                case 1:
                    levelText = 'Membership Level: Basic Member';
                    break;
                case 2:
                    levelText = 'Membership Level: Silver';
                    break;
                case 3:
                    levelText = 'Membership Level: Gold';
                    break;
                default:
                    levelText = 'Membership Level: N/A';
            }
            membershipLevel.textContent = levelText;

            // Only display image in grid view
            if (viewType === 'grid') {
                const logo = document.createElement('img');
                logo.src = `images/${member.imagefilename}`; // Assuming images are in chamber/images/
                logo.alt = `${member.name} Logo`;
                logo.loading = 'lazy';
                logo.width = 150; // Set a default width for grid view
                logo.height = 150; // Set a default height for grid view
                logo.classList.add('member-logo');
                logo.onerror = function() { // Fallback for missing images
                    this.onerror=null; // Prevent infinite loop
                    this.src='https://placehold.co/150x150/cccccc/333333?text=No+Logo';
                    this.alt='No logo available';
                };
                card.appendChild(logo);
            }

            // Append elements to the card
            card.appendChild(name);
            card.appendChild(address);
            card.appendChild(phone);
            card.appendChild(website);
            card.appendChild(membershipLevel);

            // Append the completed card to the display container
            memberDisplay.appendChild(card);
        });
    };

    // --- View Toggle Event Listeners ---
    gridViewBtn.addEventListener('click', () => {
        displayMembers(membersData, 'grid');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        displayMembers(membersData, 'list');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    // Initial data fetch when the page loads
    getMemberData();
});
