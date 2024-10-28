document.addEventListener("DOMContentLoaded", function () {
    // Check if the leaderboard element exists (to detect if we're on the leaderboard page)
    if (document.getElementById('score-list')) {
        loadLeaderboard(); // Load leaderboard if on leaderboard page
    } else if (document.getElementById('countries-grid')) {
        loadCountries(); // All Countries page
        // Search functionality
        const searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", searchCountry);
    } else {
        setupGame(); // Game page
    }
});

// Game setup function for the main game page
function setupGame() {
    let userInfo = {
        name: '',
        age: '',
        country: '',
        difficulty: ''
    };

    let timerElement = document.getElementById("timer");
    let nextQuestionButton = document.getElementById("next-question");
    let options = document.querySelectorAll(".option");
    let questionElement = document.getElementById("question");
    let didYouKnowElement = document.getElementById("did-you-know");
    let factElement = document.getElementById("fact");

    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeLeft = 10;
    let questions = [];
    let topScores = []; // Initialize empty top scores

    // Load audio files
    const correctSound = new Audio('sounds/correct.mp3');
    const wrongSound = new Audio('sounds/wrong.mp3');
    const timeUpSound = new Audio('sounds/time-up.mp3');

    // User Info Form Submission
    document.getElementById('user-info').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Capture user info
        userInfo.name = document.getElementById('name').value;
        userInfo.age = document.getElementById('age').value;
        userInfo.country = document.getElementById('country').value;
        userInfo.difficulty = document.getElementById('difficulty').value;

        // Hide welcome page and show game section
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        document.getElementById('game-container').style.display = 'block';

        loadQuestions();
    });

    // Load questions from the JSON file
    function loadQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data.questions;
                startGame();
            })
            .catch(error => console.error('Error loading questions:', error));
            
    }

    function startGame() {
        loadQuestion();
        startTimer();
    }

    function loadQuestion() {
        let q = questions[currentQuestion];
        if (q) {
            questionElement.innerText = q.question;
            
            // Check if the question has an image
            const flagImage = document.getElementById("flag-image");
            if (q.image) {
                flagImage.src = q.image;
                flagImage.style.display = "block"; // Show the flag image
            } else {
                flagImage.removeAttribute('src'); // Clear src attribute when there's no image
                flagImage.style.display = "none"; // Hide the flag image
            }
    
            options.forEach((option, index) => {
                option.innerText = q.options[index];
                option.onclick = () => checkAnswer(index);
            });
            nextQuestionButton.disabled = true;
            didYouKnowElement.style.display = "none";
        }
    }

    function startTimer() {
        timeLeft = 10;
        timerElement.innerText = `${timeLeft}s`;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.innerText = `${timeLeft}s`;
            if (timeLeft === 0) {
                clearInterval(timer);
                timeUpSound.play();
                showCorrectAnswer();
            }
        }, 1000);
    }

    function checkAnswer(index) {
        clearInterval(timer);
        let q = questions[currentQuestion];
        if (index === q.correct) {
            correctSound.play();
            score++;
            options[index].style.backgroundColor = "#2ecc71"; // Correct answer highlight
        } else {
            wrongSound.play();
            options[index].style.backgroundColor = "#e74c3c"; // Wrong answer highlight
            options[q.correct].style.backgroundColor = "#2ecc71"; // Show correct answer
        }
        showDidYouKnow();
    }

    function showCorrectAnswer() {
        let q = questions[currentQuestion];
        options[q.correct].style.backgroundColor = "#2ecc71"; // Highlight correct answer
        showDidYouKnow();
    }

    function showDidYouKnow() {
        let q = questions[currentQuestion];
        didYouKnowElement.style.display = "block";
        factElement.innerText = q.fact;
        nextQuestionButton.disabled = false;
        didYouKnowElement.classList.add('visible'); // Ensure animation is applied
    }

    nextQuestionButton.onclick = () => {
        clearInterval(timer); // Prevent overlapping intervals
        currentQuestion++;
        if (currentQuestion < questions.length) {
            resetOptions();
            loadQuestion();
            startTimer();
        } else {
            endGame();
        }
    };

    function resetOptions() {
        options.forEach(option => {
            option.style.backgroundColor = "#f1c40f"; // Reset to default color
        });
    }

    function endGame() {
        alert(`Game over! Your score: ${score}`);
        
        // Save score and user info in localStorage
        let userScore = {
            name: userInfo.name,
            score: score
        };
        let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
        topScores.push(userScore);
        topScores.sort((a, b) => b.score - a.score);
        topScores = topScores.slice(0, 3);
        localStorage.setItem('topScores', JSON.stringify(topScores));

        window.location.href = "leaderboard.html"; // Redirect to leaderboard
    }
}

// Function to load countries using RestCountries API
function loadCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            const countriesGrid = document.getElementById('countries-grid');

            data.forEach(country => {
                // Create a div for each country
                const countryDiv = document.createElement('div');
                countryDiv.classList.add('country', 'country-item');

                // Add the flag image with alt attribute
                const flagImg = document.createElement('img');
                flagImg.src = country.flags.png;
                flagImg.alt = `Flag of ${country.name.common}`; // Add alt attribute here
                countryDiv.appendChild(flagImg);

                // Add the country name
                const countryName = document.createElement('p');
                countryName.textContent = country.name.common;
                countryDiv.appendChild(countryName);

                // Add capital and population info
                const countryInfo = document.createElement('div');
                countryInfo.classList.add('country-info');
                countryInfo.innerHTML = `
                    <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                    <p>Population: ${country.population.toLocaleString()}</p>
                `;
                countryDiv.appendChild(countryInfo);

                // Append the country card to the grid
                countriesGrid.appendChild(countryDiv);
            });
        })
        .catch(error => console.error('Error loading countries:', error));
}


// Search function to filter countries
function searchCountry() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const countryItems = document.querySelectorAll(".country-item");

    countryItems.forEach(item => {
        const countryName = item.querySelector("p").textContent.toLowerCase();
        if (countryName.includes(searchInput)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

// Leaderboard functionality
function loadLeaderboard() {
    let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = ''; // Clear previous scores
    topScores.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.name}: ${s.score} points`; // Display user name and score
        scoreList.appendChild(li);
    });
}
