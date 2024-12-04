import { allPairs } from './pairs.js';
import { autocomplete } from './autocomplete.js';

let telegram = window.Telegram.WebApp;
telegram.expand()

document.addEventListener('DOMContentLoaded', async () => {
    const pairs = await allPairs();
    var n = 1;

    // function getRandomPair() {
    //     return pairs[Math.floor(Math.random() * pairs.length)];
    // }

    // function getRandomPrice() {
    //     return Math.floor(Math.random() * 100000);
    // }
    // Initialize autocomplete for all inputs with name 'pair'
    const pairInputs = document.querySelectorAll('input[name="pair"]');
    pairInputs.forEach(input => {
        autocomplete(input, pairs);
    });

    // Add addPair function to window
    window.addPair = function () {
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
                    <option value="Binance Spot">
                    <option value="Binance USDM Futures">
                    <option value="BingX Spot">
                    <option value="OKX Spot">
                    <option value="OKX USDM Futures">
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
        n += 1;
        pairContainer.appendChild(pairEntry);

        // Reinitialize autocomplete for new input
        const newInput = pairEntry.querySelector('input[name="pair"]');
        autocomplete(newInput, pairs);

        // Scroll to the new pair entry
        pairEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // // Focus on the new input field
    // newInput.focus();


    // Add removePair function to window
    window.removePair = function (button) {
        const pairContainer = document.getElementById('pair-container');
        n -= 1
        pairContainer.removeChild(button.closest('.pair-entry'));
    };


    window.submitButtonAction = () => {
        const pairEntries = document.querySelectorAll('.pair-entry');

        let exchanges = [];
        let assets = [];
        let prices = [];

        pairEntries.forEach(entry => {
            const exchangeInput = entry.querySelector('input[name="exchange"]');
            const pairInput = entry.querySelector('input[name="pair"]');
            const priceInput = entry.querySelector('input[name="price"]');

            if (!exchangeInput.value) {
                console.log('Вы не выбрали биржу');
                return;
            }

            if (!pairInput.value || !pairs.includes(pairInput.value.toUpperCase())) {
                console.log('Вы не выбрали пару или она указана некорректно');
                return;
            }

            if (!priceInput.value || priceInput.value <= 0) {
                console.log('Укажите корректную цену');
                return;
            }

            exchanges.push(exchangeInput.value.toLowerCase()
                .replace('Spot', '')
                .replace('Futures', '')
                .replace(' ', ''));
            assets.push(pairInput.value.toUpperCase());
            prices.push(+priceInput.value);
        });

        if (exchanges.length > 0 && assets.length > 0 && prices.length > 0) {
            const data = {
                exchanges,
                pairs: assets,
                prices,
            };
            telegram.sendData(JSON.stringify(data));
            telegram.close();
        } else {
            alert("Заполните все поля");
        }
    };


})