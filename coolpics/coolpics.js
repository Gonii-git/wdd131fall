// Menu toggle function for mobile view
const menuButton = document.querySelector(".menu-button");

function toggleMenu() {
    const menu = document.querySelector("nav");
    menu.classList.toggle("hide");
}

menuButton.addEventListener("click", toggleMenu);

// Handle window resize to ensure the menu is shown/hidden correctly
function handleResize() {
    const menu = document.querySelector("nav");

    if (window.innerWidth > 1000) {
        // If the window is wider than 1000px, ensure the menu is shown
        menu.classList.remove("hide");
    } else {
        // If the window is narrower than 1000px, hide the menu (default mobile behavior)
        menu.classList.add("hide");
    }
}

// Call handleResize when the page loads
handleResize();

// Add event listener for window resize
window.addEventListener("resize", handleResize);

// Get elements for the viewer modal and close button
const viewer = document.querySelector(".viewer");
const closeViewer = document.querySelector(".close-viewer");
const viewerImage = document.querySelector(".viewer img");

// Function to open the viewer modal with the clicked image
function openViewer(imageSrc) {
    viewerImage.src = imageSrc; // Set the clicked image as the modal's source
    viewer.classList.add("show");
}

// Function to close the viewer modal
function closeImageViewer() {
    viewer.classList.remove("show");
}

// Add event listener to close the viewer when the "X" button is clicked
closeViewer.addEventListener("click", closeImageViewer);

// Add click event listeners to gallery images to open the modal
const galleryImages = document.querySelectorAll(".gallery img");

galleryImages.forEach(image => {
    image.addEventListener("click", function () {
        openViewer(image.src);
    });
});
