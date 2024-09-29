// mission.js

// Select the dropdown element and the logo
const themeSelector = document.querySelector('#themeSelector');
const logo = document.querySelector('#logo');

function changeTheme() {
    const currentTheme = themeSelector.value;

    // Change the body class based on the selected theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        logo.src = 'images/byui-logo_white.png';
    } else {
        document.body.classList.remove('dark');
    }
}

// Add event listener to the select element to detect changes
themeSelector.addEventListener('change', changeTheme);
