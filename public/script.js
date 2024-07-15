document.addEventListener('DOMContentLoaded', () => {
    const baseCurrencySelect = document.getElementById('base-currency');
    const targetCurrencySelect = document.getElementById('target-currency');
    const amountInput = document.getElementById('amount');
    const convertedAmountDisplay = document.getElementById('converted-amount');
    const historicalRatesButton = document.getElementById('historical-rates');
    const saveFavoriteButton = document.getElementById('save-favorite');
    const favoritesContainer = document.getElementById('favorite-currency-pairs');
    const historicalRatesContainer = document.getElementById('historical-rates-container');
    
    let myHeaders = new Headers();
    myHeaders.append("apikey", "fca_live_yVY6tEff9UMah33sIECwZs8sCGVFb2mOquwgm2Jc");
    
    let requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };
    
    // Populate currency dropdowns with example data
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.text = currency;
        baseCurrencySelect.add(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.text = currency;
        targetCurrencySelect.add(option2);
    });

    document.getElementById('amount').value = 1;  // Set default amount

    // Event listener for converting currency
    document.getElementById('amount').addEventListener('input', convertCurrency);
    baseCurrencySelect.addEventListener('change', convertCurrency);
    targetCurrencySelect.addEventListener('change', convertCurrency);

    function convertCurrency() {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const amount = amountInput.value;

        if (amount && baseCurrency && targetCurrency) {
            fetch(`https://api.freecurrencyapi.com/v1/latest?base_currency=${baseCurrency}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const rate = data.data[targetCurrency];
                    const convertedAmount = amount * rate;
                    convertedAmountDisplay.innerText = convertedAmount.toFixed(2);
                })
                .catch(error => console.log('error', error));
        }
    }

    historicalRatesButton.addEventListener('click', () => {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const date = '2021-12-31'; // Example date

        fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_yVY6tEff9UMah33sIECwZs8sCGVFb2mOquwgm2Jc&date=${date}&base_currency=${baseCurrency}&currencies=${targetCurrency}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const rate = data.data[date][targetCurrency];
                historicalRatesContainer.innerText = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
            })
            .catch(error => console.log('error', error));
    });

    saveFavoriteButton.addEventListener('click', () => {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const favoritePair = `${baseCurrency}/${targetCurrency}`;

        fetch('/save-favorite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favoritePair })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const favoriteButton = document.createElement('button');
                favoriteButton.innerText = favoritePair;
                favoriteButton.addEventListener('click', () => {
                    const [base, target] = favoritePair.split('/');
                    baseCurrencySelect.value = base;
                    targetCurrencySelect.value = target;
                    convertCurrency();  // Trigger conversion
                });
                favoritesContainer.appendChild(favoriteButton);
            }
        })
        .catch(error => console.log('error', error));
    });

    // Fetch and display saved favorites
    fetch('/favorites')
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
        .catch(error => console.log('error', error));
});
