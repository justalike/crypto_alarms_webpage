import { autocomplete } from './autocomplete.js';
import { exchangeSymbols } from './exchangeSymbols.js';
let telegram = window.Telegram.WebApp;
telegram.expand()
let n = 1;
// document.addEventListener('DOMContentLoaded', async () => {
//     const pairs = await allPairs();
//     var n = 1;

//     // function getRandomPair() {
//     //     return pairs[Math.floor(Math.random() * pairs.length)];
//     // }

//     // function getRandomPrice() {
//     //     return Math.floor(Math.random() * 100000);
//     // }
//     // Initialize autocomplete for all inputs with name 'pair'
//     const pairInputs = document.querySelectorAll('input[name="pair"]');
//     pairInputs.forEach(input => {
//         autocomplete(input, pairs);
//     });

//     // Add addPair function to window
//     window.addPair = function () {
//         const pairContainer = document.getElementById('pair-container');
//         const pairEntry = document.createElement('div');
//         pairEntry.className = 'pair-entry';
//         pairEntry.innerHTML = `
//         <div class="divider"></div>
//         <div class="autocomplete">
//             <div class="input-container">
//                 <label class="price-label">${n + 1}</label>
//                 <input type="text" id="exchange${n + 1}" name="exchange" list="exchanges" placeholder="Биржа" required>
//                 <datalist id="exchanges">
//                     <option value="Binance Spot">
//                     <option value="Binance USDM Futures">
//                     <option value="OKX Spot">
//                     <option value="OKX USDM Futures">
//                     <option value="Bybit Spot">
//                     <option value="Bybit USDM Futures">
//                     <option value="BingX Spot">
//                     <option value="BingX USDM Futures">
//                     <option value="Bitget Spot">
//                     <option value="Bitget USDM Futures">
//                     <option value="MEXC Spot">
//                     <option value="MEXC USDM Futures">
//                 </datalist>   
//                 <input type="text" id="pair${n + 1}" name="pair" placeholder="Введите пару" required>
//                 <button class="remove-pair-btn" onclick="removePair(this)">-</button>
//             </div>
//         </div>
//         <div class="input-container">
//             <label class="price-label">$</label>
//             <input type="number" id="price${n + 1}" name="price" value="" placeholder="Укажите цену">
//         </div>
//     `;
//         n += 1;
//         pairContainer.appendChild(pairEntry);

//         // Reinitialize autocomplete for new input
//         const newInput = pairEntry.querySelector('input[name="pair"]');
//         autocomplete(newInput, pairs);

//         // Scroll to the new pair entry
//         pairEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     };

//     // // Focus on the new input field
//     // newInput.focus();


//     // Add removePair function to window
//     window.removePair = function (button) {
//         const pairContainer = document.getElementById('pair-container');
//         n -= 1
//         pairContainer.removeChild(button.closest('.pair-entry'));
//     };


//     window.submitButtonAction = () => {
//         const pairEntries = document.querySelectorAll('.pair-entry');

//         let exchanges = [];
//         let assets = [];
//         let prices = [];

//         pairEntries.forEach(entry => {
//             const exchangeInput = entry.querySelector('input[name="exchange"]');
//             const pairInput = entry.querySelector('input[name="pair"]');
//             const priceInput = entry.querySelector('input[name="price"]');

//             if (!exchangeInput.value) {
//                 console.log('Вы не выбрали биржу');
//                 return;
//             }

//             if (!pairInput.value || !pairs.includes(pairInput.value.toUpperCase())) {
//                 console.log('Вы не выбрали пару или она указана некорректно');
//                 return;
//             }

//             if (!priceInput.value || priceInput.value <= 0) {
//                 console.log('Укажите корректную цену');
//                 return;
//             }

//             exchanges.push(exchangeInput.value.toLowerCase());
//             assets.push(pairInput.value.toUpperCase());
//             prices.push(+priceInput.value);
//         });

//         if (exchanges.length > 0 && assets.length > 0 && prices.length > 0) {
//             const data = {
//                 exchanges,
//                 pairs: assets,
//                 prices,
//             };
//             telegram.sendData(JSON.stringify(data));
//             telegram.close();
//         } else {
//             alert("Заполните все поля");
//         }
//     };


// })

const parseExchangeValue = (value) => {
    const [exchange, market] = value.split(' ');
    return { exchange: exchange.toLowerCase(), market: market === 'Spot' ? 'spot' : 'futures' };
};

// Initialize autocomplete for pair inputs
const initializeAutocomplete = (pairInput, exchange, market) => {
    const symbols = exchangeSymbols[exchange]?.[market] || [];
    autocomplete(pairInput, symbols);
};

const addPair = function () {
    const pairContainer = document.getElementById('pair-container');
    const pairEntry = document.createElement('div');
    pairEntry.className = 'pair-entry';
    pairEntry.innerHTML = `
            <div class="divider"></div>
            <div class="autocomplete">
                <div class="input-container">
                    <label class="price-label">${n + 1}</label>
                    <input type="text" id="exchange${n + 1}" name="exchange" list="exchanges" placeholder="Биржа" required>
                    <datalist id="exchanges">
                        ${Object.keys(exchangeSymbols)
            .map((exchange) =>
                ['Spot', 'Futures']
                    .map((market) => `<option value="${exchange} ${market}">`)
                    .join('')
            )
            .join('')}
                    </datalist>
                    <input type="text" id="pair${n + 1}" name="pair" placeholder="Введите пару" required>
                    <button class="remove-pair-btn" onclick="removePair(this)">-</button>
                </div>
            </div>
            <div class="input-container">
                <label class="price-label">$</label>
                <input type="number" id="price${n + 1}" name="price" value="" placeholder="Укажите цену">
            </div>
        `;
    pairContainer.appendChild(pairEntry);

    const exchangeInput = pairEntry.querySelector(`#exchange${n + 1}`);
    const pairInput = pairEntry.querySelector(`#pair${n + 1}`);

    addExchangeListener(exchangeInput, pairInput);

    n += 1;

    // Scroll to the new pair entry
    pairEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Remove a pair entry
const removePair = function (button) {
    const pairContainer = document.getElementById('pair-container');
    pairContainer.removeChild(button.closest('.pair-entry'));
    n -= 1;
};

// Submit form data to Telegram
const submitButtonAction = () => {
    const pairEntries = document.querySelectorAll('.pair-entry');
    const exchanges = [];
    const pairs = [];
    const prices = [];

    pairEntries.forEach((entry) => {
        const exchangeInput = entry.querySelector('input[name="exchange"]');
        const pairInput = entry.querySelector('input[name="pair"]');
        const priceInput = entry.querySelector('input[name="price"]');

        if (!exchangeInput.value) {
            console.log('Вы не выбрали биржу');
            return;
        }

        const { exchange, market } = parseExchangeValue(exchangeInput.value);
        const symbols = exchangeSymbols[exchange]?.[market] || [];

        if (!pairInput.value || !symbols.includes(pairInput.value.toUpperCase())) {
            console.log('Вы не выбрали пару или она указана некорректно');
            return;
        }

        if (!priceInput.value || priceInput.value <= 0) {
            console.log('Укажите корректную цену');
            return;
        }

        exchanges.push(exchangeInput.value.toLowerCase());
        pairs.push(pairInput.value.toUpperCase());
        prices.push(+priceInput.value);
    });

    if (exchanges.length && pairs.length && prices.length) {
        const data = { exchanges, pairs, prices };
        telegram.sendData(JSON.stringify(data));
        telegram.close();
    } else {
        alert('Заполните все поля');
    }
};
// Add change event listener to exchange inputs
const addExchangeListener = (exchangeInput, pairInput) => {
    exchangeInput.addEventListener('change', () => {
        const { exchange, market } = parseExchangeValue(exchangeInput.value);
        initializeAutocomplete(pairInput, exchange, market);
    });



};



document.addEventListener('DOMContentLoaded', async () => {
    // Load exchange symbols from JSON
    const exchangeSymbols = await fetch('./exchangeSymbols.json').then((res) => res.json());
    window.addPair = addPair;
    window.removePair = removePair;
    window.submitButtonAction = submitButtonAction;
    // Parse exchange input value to get exchange and market

    // Dynamically add a new pair entry

    const addPairButton = document.getElementById('add-pair-btn');
    addPairButton.addEventListener('click', addPair);

    // Submit form data to Telegram
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', submitButtonAction);

    const removePairButton = document.getElementById('remove-pair-btn');
    removePairButton.addEventListener('click', removePair);


    // Add event listeners for existing exchange inputs
    const exchangeInputs = document.querySelectorAll('input[name="exchange"]');
    exchangeInputs.forEach((exchangeInput, index) => {
        const pairInput = document.getElementById(`pair${index + 1}`);
        addExchangeListener(exchangeInput, pairInput);
    });
});
