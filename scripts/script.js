// Array of course objects
const courses = [
    {
        "subject": "CSE",
        "number": 110,
        "title": "Introduction to Web Technologies",
        "credits": 3,
        "completed": false, 
        "active": true
    },
    {
        "subject": "WDD",
        "number": 130,
        "title": "Web Fundamentals",
        "credits": 3,
        "completed": true, // Marked as completed
        "active": true
    },
    {
        "subject": "CSE",
        "number": 111,
        "title": "Programming with Functions",
        "credits": 3,
        "completed": true, // Marked as completed
        "active": true
    },
    {
        "subject": "WDD",
        "number": 131,
        "title": "Dynamic Web Fundamentals",
        "credits": 3,
        "completed": true, //marked as completed
        "active": true
    },
    {
        "subject": "WDD",
        "number": 231,
        "title": "Web Backend Development",
        "credits": 3,
        "completed": false,
        "active": true
    },
    {
        "subject": "CSE",
        "number": 210,
        "title": "Programming with Classes",
        "credits": 3,
        "completed": false, 
        "active": false 
    },
    {
        "subject": "ITM",
        "number": 111,
        "title": "Introduction to Databases",
        "credits": 3,
        "completed": false,
        "active": false 
    }
];

// Get DOM elements
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');
const courseListContainer = document.getElementById('course-list');
const totalCreditsSpan = document.getElementById('total-credits');
const filterButtons = document.querySelectorAll('.filter-button');
const currentYearSpan = document.getElementById('currentyear');
const lastModifiedParagraph = document.getElementById('lastModified');

/**
 * Toggles the visibility of the main navigation menu for mobile.
 */
function toggleMenu() {
    mainNav.classList.toggle('active');
}

/**
 * Displays courses in the course list container.
 * Only active courses will be displayed.
 * @param {Array} courseArray - The array of course objects to display.
 */
function displayCourses(courseArray) {
    courseListContainer.innerHTML = ''; // Clear existing content

    // Filter for active courses before displaying
    const activeCourses = courseArray.filter(course => course.active);

    if (activeCourses.length === 0) {
        courseListContainer.innerHTML = '<p class="text-center text-gray-600">No active courses to display for this filter.</p>';
        calculateTotalCredits(activeCourses); // Still calculate 0 credits
        return;
    }

    activeCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');

        // Add 'completed' class if the course is marked as completed
        if (course.completed) {
            courseCard.classList.add('completed');
        }

        courseCard.innerHTML = `
            <h3 class="course-title">${course.subject} ${course.number}: ${course.title}</h3>
            <p class="course-details">Credits: ${course.credits}</p>
        `;
        courseListContainer.appendChild(courseCard);
    });

    calculateTotalCredits(activeCourses); // Update total credits for active courses
}

/**
 * Calculates and displays the total credits for the given array of courses.
 * @param {Array} courseArray - The array of course objects.
 */
function calculateTotalCredits(courseArray) {
    const totalCredits = courseArray.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsSpan.textContent = totalCredits;
}

/**
 * Handles filtering of courses based on the clicked button.
 * @param {Event} event - The click event object.
 */
function filterCourses(event) {
    // Remove 'active' class from all buttons
    filterButtons.forEach(button => button.classList.remove('active'));

    // Add 'active' class to the clicked button
    event.target.classList.add('active');

    const filterType = event.target.id;
    let filteredCourses = [];

    switch (filterType) {
        case 'filter-all':
            filteredCourses = courses;
            break;
        case 'filter-wdd':
            filteredCourses = courses.filter(course => course.subject === 'WDD');
            break;
        case 'filter-cse':
            filteredCourses = courses.filter(course => course.subject === 'CSE');
            break;
        default:
            filteredCourses = courses; // Default to all if something goes wrong
    }
    displayCourses(filteredCourses); // Call displayCourses which will handle the 'active' filter
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Set current year dynamically
    currentYearSpan.textContent = new Date().getFullYear();

    // Set last modified date dynamically
    // document.lastModified returns a string, no need for complex formatting
    lastModifiedParagraph.textContent += document.lastModified;

    // Initial display of all active courses
    displayCourses(courses);

    // Hamburger menu event listener
    hamburger.addEventListener('click', toggleMenu);

    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', filterCourses);
    });
});
