//DOM ELEMENT ensures code run only after entire htlm doc is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const baseCurrencySelect = document.getElementById('base-currency');
    const targetCurrencySelect = document.getElementById('target-currency');
    const amountInput = document.getElementById('amount');
    const convertedAmountDisplay = document.getElementById('converted-amount');
    const historicalRatesButton = document.getElementById('historical-rates');
    const saveFavoriteButton = document.getElementById('save-favorite');
    const favoritesContainer = document.getElementById('favorite-currency-pairs');
    const historicalRatesContainer = document.getElementById('historical-rates-container');
    const datePicker = document.getElementById('date-picker');
    const errorMessageContainer = document.getElementById('error-message');
//Initializes a new Headers object
    let myHeaders = new Headers();
    myHeaders.append("apikey", "fca_live_yVY6tEff9UMah33sIECwZs8sCGVFb2mOquwgm2Jc");

    //Creates an object that specifies options for an HTTP request
    let requestOptions = {
        method: 'GET', // the HTTP method to handle redirects
        redirect: 'follow',
        headers: myHeaders
    };
    
    // Populate currency dropdowns with example data
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'PKR', 'MYR', 'INR','IDR'];
    
    // Iterates over each currency in the currencies array.
    currencies.forEach(currency => {
        const option1 = document.createElement('option'); //option element populates dropdowns with a list 
        option1.value = currency;
        option1.text = currency;
        baseCurrencySelect.add(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.text = currency;
        targetCurrencySelect.add(option2);
    });

    document.getElementById('amount').value = 1;  // Set default amount

   // show error messages

    function showError(message) {
        errorMessageContainer.innerText = message;
    }
    // Function to clear error messages
    function clearError() {
        errorMessageContainer.innerText = '';
    }

    // Event listener for converting currency
    document.getElementById('amount').addEventListener('input', convertCurrency); //event listener triggers convertCurrency Fn
    baseCurrencySelect.addEventListener('change', convertCurrency); //whenever smount input or slected currency chnages
    targetCurrencySelect.addEventListener('change', convertCurrency);

    function convertCurrency() {
        clearError();
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const amount = parseFloat(amountInput.value);


        if (isNaN(amount) || amount <= 0) {
            showError('Please enter a valid positive number for the amount.');
            return;
        }

        if (baseCurrency === targetCurrency) {
            showError('Base and target currencies cannot be the same.');
            return;

        }

        if (amount && baseCurrency && targetCurrency) {
            fetch(`https://api.freecurrencyapi.com/v1/latest?base_currency=${baseCurrency}`, requestOptions)
                .then(response => response.json()) // Convert the response to JSON
                .then(data => { //Handle the parsed JSON data
                    if (!data.data || !data.data[targetCurrency]) { //if the required data is present and then calculates the converted amount. 
                        showError('Failed to fetch the conversion rate.');
                        return;
                    }
                    const rate = data.data[targetCurrency];
                    const convertedAmount = amount * rate;
                    convertedAmountDisplay.innerText = convertedAmount.toFixed(2);
                })
                .catch(error => {
                    console.log('error', error);
                    showError('Failed to fetch conversion data. Please try again later.');
                });
        }
    }
//ADD A BUTTON THAT TRIGGERS A FUNCTION WHEN CLICKED 
    historicalRatesButton.addEventListener('click', () => {
        clearError();
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const date = datePicker.value; // Get selected date

        if (!date) {
            alert("Please choose a date.");
            return;
        }

        fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_yVY6tEff9UMah33sIECwZs8sCGVFb2mOquwgm2Jc&date=${date}&base_currency=${baseCurrency}&currencies=${targetCurrency}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (!data.data || !data.data[date] || !data.data[date][targetCurrency]) {
                    showError('Failed to fetch historical rates.');
                    return;
                }
                const rate = data.data[date][targetCurrency];
                historicalRatesContainer.innerText = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
            })
            .catch(error => {
                console.log('error', error);
                showError('Failed to fetch historical rates. Please try again later.');
            });
    });
    saveFavoriteButton.addEventListener('click', () => { // fetch request to server save-favourite endpoint 
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const favoritePair = `${baseCurrency}/${targetCurrency}`;

        fetch('/save-favorite', {
            method: 'POST', // a fetch POST request to send data to server with headers and body containing favoritePair.
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favoritePair })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) { //Processes the response as JSON, checks if saving was successful 
                const favoriteButton = document.createElement('button');
                favoriteButton.innerText = favoritePair;
                favoriteButton.addEventListener('click', () => {
                    const [base, target] = favoritePair.split('/');
                    baseCurrencySelect.value = base;
                    targetCurrencySelect.value = target;
                    convertCurrency();  // Trigger conversion
                });
                favoritesContainer.appendChild(favoriteButton); //appends favourite button child element to parent element 
            }
        })
        .catch(error => console.log('error', error));
        

    });

    // Fetch and display saved favorites
    fetch('/favorites') //fetch data from server endpoint favoutires 
        .then(response => response.json())
        .then(favorites => {
            favorites.forEach(favorite => {
                const favoriteButton = document.createElement('button');
                favoriteButton.innerText = favorite.pair;
                favoriteButton.addEventListener('click', () => {
                    const [base, target] = favorite.pair.split('/');
                    baseCurrencySelect.value = base;
                    targetCurrencySelect.value = target;
                    convertCurrency();  // Trigger conversion
                });
                favoritesContainer.appendChild(favoriteButton);
            });
        })
        .catch(error => console.log('Error fetching favorites', error));
});
