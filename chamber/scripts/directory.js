// directory.js - Handles fetching and displaying member data, and view toggling

document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANT: Path to members.json is relative to directory.html
    // If directory.html is in 'wdd231/chamber/' and members.json is in 'wdd231/chamber/data/'
    // then 'data/members.json' is the correct path.
    const url = 'data/members.json'; 
    const memberDisplay = document.getElementById('member-display');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');

    let membersData = []; // To store fetched data globally for toggling

    /**
     * Fetches member data from the JSON file.
     */
    async function getMemberData() {
        console.log("Attempting to fetch data from:", url); // Debugging: Check the URL being fetched
        try {
            const response = await fetch(url);
            console.log("Fetch response received:", response); // Debugging: Check the raw response object
            
            if (!response.ok) {
                // If response is not OK (e.g., 404 Not Found, 500 Server Error), throw an error
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText || 'Unknown Error'}`);
            }
            
            membersData = await response.json(); // Parse the JSON data
            console.log("Data successfully parsed:", membersData); // Debugging: Check the parsed data array
            
            if (membersData.length === 0) {
                memberDisplay.innerHTML = '<p class="info-message" style="text-align: center; color: #555;">No member data found in members.json.</p>';
                return;
            }

            displayMembers(membersData, 'grid'); // Display in grid view by default
        } catch (error) {
            console.error("Error fetching or parsing member data:", error);
            // Display a user-friendly message on the page if data cannot be loaded
            memberDisplay.innerHTML = '<p class="error-message" style="text-align: center; color: red; font-weight: bold;">Failed to load member data. Please check the browser console (F12) for error details. Ensure `members.json` exists, its path is correct, and it contains valid JSON.</p>';
        }
    }

    /**
     * Displays member information in either grid or list view.
     * @param {Array<Object>} members - An array of member objects.
     * @param {string} viewType - 'grid' or 'list'.
     */
    const displayMembers = (members, viewType) => {
        console.log(`Displaying ${members.length} members in ${viewType} view.`); // Debugging: Confirm display call
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
                // IMPORTANT: This path is relative to directory.html
                // If member logos are in 'wdd231/images/', use `../images/${member.imagefilename}`
                // If member logos are in 'wdd231/chamber/images/', use `images/${member.imagefilename}`
                // Based on your directory.html, the main logo is '../images/my-logo.png', so assuming member logos are there too.
                logo.src = `../images/${member.imagefilename}`; 
                logo.alt = `${member.name} Logo`;
                logo.loading = 'lazy';
                logo.width = 150; // Set a default width for grid view
                logo.height = 150; // Set a default height for grid view
                logo.classList.add('member-logo');
                logo.onerror = function() { // Fallback for missing images
                    console.warn(`Image failed to load: ${this.src}. Using placeholder.`);
                    this.onerror=null; // Prevent infinite loop if placeholder also fails
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
