// Declare a const variable named "url" that contains the URL string of the JSON resource.
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Declare a const variable name "cards" that selects the HTML div element from the document with an id value of "cards".
const cards = document.querySelector('#cards');

/**
 * Asynchronously fetches prophet data from the specified URL and displays it.
 */
async function getProphetData() {
    try {
        // Fetch data from the JSON source url using the await fetch() method.
        const response = await fetch(url);

        // Convert the response to a JSON object using the .json method.
        const data = await response.json();

        // console.table(data.prophets); // Temporary testing of data response - uncomment to see data in console

        // Call the displayProphets function, passing the 'prophets' array from the data object.
        // We pass data.prophets because the displayProphets function expects an array parameter,
        // and 'prophets' is the array containing all the prophet objects within the JSON data.
        displayProphets(data.prophets);
    } catch (error) {
        console.error("Error fetching or parsing prophet data:", error);
        // Display a user-friendly message on the page if data cannot be loaded
        cards.innerHTML = '<p style="text-align: center; color: red;">Failed to load prophet data. Please try again later.</p>';
    }
}

/**
 * Defines a function expression named "displayProphets" that handles a single parameter named "prophets".
 * It processes the array and builds a card for each prophet.
 * @param {Array<Object>} prophets - An array of prophet objects.
 */
const displayProphets = (prophets) => {
    // Use a forEach loop with the array parameter to process each "prophet" record.
    prophets.forEach((prophet) => {
        // Create elements to add to the #cards element
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let portrait = document.createElement('img');
        let birthDate = document.createElement('p'); // For Date of Birth
        let birthPlace = document.createElement('p'); // For Place of Birth

        // Build the h2 content to show the prophet's full name
        // Using template strings to combine name and lastname properties
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        // Build the image portrait by setting all the relevant attributes
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy'); // Optimize image loading
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        // Populate Date of Birth and Place of Birth
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

        // Append the created elements to the section (card)
        card.appendChild(fullName);
        card.appendChild(birthDate);   // Add birth date
        card.appendChild(birthPlace);  // Add birth place
        card.appendChild(portrait);

        // Finally, add the section card to the "cards" div
        cards.appendChild(card);
    }); // end of forEach loop
};

// Call the function getProphetData() in the main line of your .js code to test the fetch and response.
getProphetData();
