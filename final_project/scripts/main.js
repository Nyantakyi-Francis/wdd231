// main.js - This script contains the main logic for the home page.

/**
 * Sets the current year in the footer of the page.
 * This is a simple DOM manipulation task to meet project requirements.
 */
export function setCurrentYear() {
    // Select the span element with the ID 'current-year'.
    const yearSpan = document.getElementById('current-year');
    
    // Check if the element exists to prevent errors.
    if (yearSpan) {
        // Get the current year from the Date object.
        const currentYear = new Date().getFullYear();
        
        // Update the text content of the span with the current year.
        yearSpan.textContent = currentYear;
    }
}

// Ensure the DOM is fully loaded before running the script.
document.addEventListener('DOMContentLoaded', setCurrentYear);
