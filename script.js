import { allPairs } from './pairs.js';
import { autocomplete } from './autocomplete.js';

document.addEventListener('DOMContentLoaded', async () => {
    const pairs = await allPairs();

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
           
            <div class="autocomplete">
                <div class="input-container">
                    <input type="text" name="pair" placeholder="BTCUSDT" required>
                    <button class="remove-pair-btn" onclick="removePair(this)">🗑️</button>
                </div>
            </div>
            <div class="input-container">
                <label class="price-label">Цена, $</label>
                <input type="number" value="" placeholder="45170">
            </div>
            <div class="divider"></div>
        `;
        pairContainer.appendChild(pairEntry);

        // Reinitialize autocomplete for new input
        const newInput = pairEntry.querySelector('input[name="pair"]');
        autocomplete(newInput, pairs);
    };

    // Add removePair function to window
    window.removePair = function (button) {
        const pairContainer = document.getElementById('pair-container');
        pairContainer.removeChild(button.closest('.pair-entry'));
    };
});
