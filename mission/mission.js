// Select the dropdown element
const themeSelector = document.querySelector('#themeSelector');
const logo = document.querySelector('#logo'); // Assuming there's an img with id "logo"

function changeTheme() {
    // Check the current value of the select element
    const currentTheme = themeSelector.value;

    // If the value is 'dark', add the dark class to the body and change the logo
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        logo.src = 'path_to_white_logo.png'; // Change to the path of your white logo
    } else {
        // Otherwise, remove the dark class and revert to the blue logo
        document.body.classList.remove('dark');
        logo.src = 'path_to_blue_logo.png'; // Change to the path of your blue logo
    }
}

// Add event listener to the select element to detect changes
themeSelector.addEventListener('change', changeTheme);
