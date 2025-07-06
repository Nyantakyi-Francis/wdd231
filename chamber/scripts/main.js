// main.js - Handles site-wide JavaScript functionality

document.addEventListener('DOMContentLoaded', () => {
    // --- Dynamic Copyright Year ---
    const currentYearSpan = document.getElementById('currentyear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Last Modification Date ---
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        // Get the last modified date of the document
        // Note: This often reflects the server's last modified date or the file's last save date.
        // For client-side JS, it's typically document.lastModified.
        lastModifiedSpan.textContent = new Date(document.lastModified).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // --- Hamburger Menu Toggle ---
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            hamburgerBtn.classList.toggle('open'); // Add class to button for animation
        });

        // Close nav when a link is clicked (for single-page navigation or smooth UX)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    hamburgerBtn.classList.remove('open');
                }
            });
        });
    }
});
