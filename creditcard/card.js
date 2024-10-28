
// Initialize the form and its elements
const cardBtn = document.getElementById('card-btn');
const cardHolderInput = document.getElementById('card-holder');
const cardNumberInput = document.getElementById('card-number');
const cardMonthInput = document.getElementById('card-month');
const cardYearInput = document.getElementById('card-year');
const cardCvcInput = document.getElementById('card-cvc');

const cardSuccess = document.getElementById('card-success');
const formErrors = document.getElementById('form-errors');
const cardError = document.getElementById('card-error');

// Handle button click
cardBtn.addEventListener('click', function () {
    // Validate fields
    const cardHolder = cardHolderInput.value.trim();
    const cardNumber = cardNumberInput.value.replace(/\s/g, ''); // Remove spaces
    const expiryMonth = cardMonthInput.value;
    const expiryYear = cardYearInput.value;
    const cvv = cardCvcInput.value;

    console.log('Validating card details:', { cardHolder, cardNumber, expiryMonth, expiryYear, cvv });

    if (!validateCard(cardNumber, expiryMonth, expiryYear, cvv)) {
        showError("Invalid card details");
        return;
    }

    // If valid, show success message
    showSuccess();
});

// Function to validate card details
function validateCard(number, month, year, cvv) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear() % 100; // Last two digits of the year

    const isValidNumber = number.length === 16 && /^\d+$/.test(number);
    const isValidExpiry = month >= 1 && month <= 12 && (year > currentYear || (year == currentYear && month >= currentMonth));
    const isValidCvc = cvv.length === 3 && /^\d+$/.test(cvv);

    console.log('Validation results:', { isValidNumber, isValidExpiry, isValidCvc });
    return isValidNumber && isValidExpiry && isValidCvc;
}

// Function to show error message
function showError(message) {
    console.error(message); // Log the error message
    formErrors.classList.remove('hidden');
    cardError.textContent = message;
    cardSuccess.classList.add('hidden'); // Hide success message if showing
}

// Function to show success message
function showSuccess() {
    cardSuccess.classList.remove('hidden');
    formErrors.classList.add('hidden'); // Hide error messages if showing
    resetForm(); // Reset form fields after submission
}

// Function to reset the form
function resetForm() {
    cardHolderInput.value = '';
    cardNumberInput.value = '';
    cardMonthInput.value = '';
    cardYearInput.value = '';
    cardCvcInput.value = '';
}
