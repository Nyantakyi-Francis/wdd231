// community.js - This script handles review submissions, displays reviews from local storage,
// and features a random anime studio.

// Import the setCurrentYear function from the main.js module.
import { setCurrentYear } from './main.js';

const REVIEWS_STORAGE_KEY = 'animeReviews';

/**
 * Loads reviews from local storage and displays them.
 */
function loadAndDisplayReviews() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    try {
        const storedReviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY)) || [];
        reviewsList.innerHTML = ''; // Clear existing content

        if (storedReviews.length === 0) {
            reviewsList.innerHTML = `<p style="text-align: center; font-style: italic; width: 100%;">No reviews have been submitted yet.</p>`;
            return;
        }

        // Display reviews in reverse chronological order (most recent first)
        storedReviews.reverse().forEach(review => {
            const reviewCard = `
                <div class="grid-item">
                    <div class="grid-item-content">
                        <h3>${review.animeTitle}</h3>
                        <p><strong>Reviewer:</strong> ${review.userName}</p>
                        <p><strong>Rating:</strong> ${review.rating} out of 5</p>
                        <p class="description">${review.reviewText}</p>
                        <p style="font-size: 0.75rem; color: #888;">Submitted on: ${new Date(review.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
            reviewsList.innerHTML += reviewCard; // Append to show newest first
        });
    } catch (error) {
        // console.error('Error loading reviews from local storage:', error); // Removed console.error
        reviewsList.innerHTML = `<p style="text-align: center; color: red; width: 100%;">Error loading reviews.</p>`;
    }
}

/**
 * Handles the submission of the review form.
 * @param {Event} event - The form submission event.
 */
function handleReviewSubmission(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const animeName = form['anime-name'].value;
    const userName = form['user-name'].value;
    const ratingElement = form.querySelector('input[name="rating"]:checked');
    const rating = ratingElement ? ratingElement.value : '';
    const reviewText = form['review-text'].value;
    const timestamp = new Date().toISOString(); // Store timestamp for sorting

    if (!animeName || !userName || !rating || !reviewText) {
        // This basic validation is usually handled by 'required' attribute, but good to have a JS fallback
        // console.warn('Please fill in all review fields.'); // Removed console.warn
        return;
    }

    const newReview = {
        animeTitle: animeName,
        userName: userName,
        rating: rating,
        reviewText: reviewText,
        timestamp: timestamp
    };

    try {
        const storedReviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY)) || [];
        storedReviews.push(newReview);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(storedReviews));
        
        form.reset(); // Clear the form
        loadAndDisplayReviews(); // Reload reviews to show the new one
    } catch (error) {
        // console.error('Error saving review to local storage:', error); // Removed console.error
        // Provide user feedback (e.g., a message on the page) if saving fails
    }
}

/**
 * Renders the studio information on the page.
 * @param {Object} studio - The studio object to render.
 */
function renderStudio(studio) {
    const studioContent = document.getElementById('studio-content');
    if (!studioContent) return;

    // Use a template literal to create the HTML for the studio information.
    studioContent.innerHTML = `
        <div class="grid-item" style="text-align: left;">
            <div class="grid-item-content">
                <h3>${studio.name}</h3>
                <p><strong>Notable Works:</strong> ${studio.notableWorks.join(', ')}</p>
                <p class="description"><strong>Description:</strong> ${studio.description}</p>
            </div>
        </div>
    `;
}

/**
 * Fetches data from the local JSON file and displays a random studio.
 */
async function loadStudioContent() {
    const studioContent = document.getElementById('studio-content');
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const studios = data.studios;
        if (studios.length > 0) {
            const randomIndex = Math.floor(Math.random() * studios.length);
            const randomStudio = studios[randomIndex];
            renderStudio(randomStudio);
        } else {
            studioContent.innerHTML = `<p style="text-align: center; font-style: italic; width: 100%;">No studio data available.</p>`;
        }
    } catch (error) {
        // console.error('Failed to load studio data:', error); // Removed console.error
        studioContent.innerHTML = `<p style="text-align: center; color: red; width: 100%;">Failed to load studio data. Please try again later.</p>`;
    }
}

// Initialize the page content and functionality when the DOM is loaded.
document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear(); // Set the current year in the footer
    
    // Initialize review form and display existing reviews
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmission);
    }
    loadAndDisplayReviews();

    // Load and display random studio content
    loadStudioContent();
});
