// chamber/scripts/join.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Timestamp Functionality ---
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        // Get the current date and time
        const now = new Date();
        // Format it as an ISO string (e.g., "2023-10-27T10:30:00.000Z")
        // This is a good format for backend processing if the form were submitted
        timestampField.value = now.toISOString();
    }

    // --- Membership Benefits Modals Functionality ---

    // Get all buttons that open modals
    const benefitsButtons = document.querySelectorAll('.benefits-button');
    // Get all close buttons for modals
    const closeButtons = document.querySelectorAll('.close-button');
    // Get all modal elements
    const modals = document.querySelectorAll('.modal');

    // Function to open a modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex'; // Use flex to center the content
            // Add a class for potential animations if needed (e.g., fade-in)
            modal.classList.add('modal-open');
        }
    }

    // Function to close a modal
    function closeModal(modalElement) {
        if (modalElement) {
            // Add a class for fade-out animation
            modalElement.classList.add('modal-closing');
            // Remove the modal after the animation finishes
            modalElement.addEventListener('animationend', () => {
                modalElement.style.display = 'none';
                modalElement.classList.remove('modal-closing', 'modal-open');
            }, { once: true }); // Ensure the event listener runs only once
        }
    }

    // Add event listeners to "Learn More" buttons
    benefitsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const modalId = event.target.dataset.modal; // Get the modal ID from data-modal attribute
            openModal(modalId);
        });
    });

    // Add event listeners to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal'); // Find the parent modal element
            closeModal(modal);
        });
    });

    // Close modal if user clicks outside of the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            // Check if the click occurred directly on the modal overlay, not its content
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
});