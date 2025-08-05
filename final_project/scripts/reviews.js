// reviews.js - This script handles the review form submission and displays reviews on the page.

// Import the setCurrentYear function from the main.js module.
import { setCurrentYear } from './main.js';

/**
 * Initializes the review form functionality.
 */
function initReviews() {
    const form = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    // Add a submit event listener to the form.
    form.addEventListener('submit', (event) => {
        // Prevent the default form submission behavior.
        event.preventDefault();

        // Get the values from the form inputs.
        const animeName = document.getElementById('anime-name').value;
        const userName = document.getElementById('user-name').value;
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const reviewText = document.getElementById('review-text').value;

        // Use a template literal to create the HTML for the new review.
        const reviewCard = `
            <div class="grid-item">
                <div class="grid-item-content">
                    <h3>${animeName}</h3>
                    <p><strong>Reviewer:</strong> ${userName}</p>
                    <p><strong>Rating:</strong> ${rating} out of 5</p>
                    <p class="description">${reviewText}</p>
                </div>
            </div>
        `;

        // Check if there's a placeholder message and remove it.
        if (reviewsList.querySelector('p')) {
            reviewsList.innerHTML = '';
        }

        // Add the new review to the top of the list.
        reviewsList.innerHTML = reviewCard + reviewsList.innerHTML;

        // Reset the form after successful submission.
        form.reset();
    });
}

// Ensure the DOM is fully loaded before running the script.
document.addEventListener('DOMContentLoaded', () => {
    // Call the function to initialize the review form.
    initReviews();
    // Also, call the function to set the current year in the footer.
    setCurrentYear();
});
