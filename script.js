import { allPairs } from './pairs.js';
import { autocomplete } from './autocomplete.js';

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
                    <input type="text" name="pair" placeholder="Введите пару" required>
                    <button class="remove-pair-btn" onclick="removePair(this)">-</button>
                </div>
            </div>
            <div class="input-container">
                <label class="price-label">$</label>
                <input type="number" value="" placeholder="Укажите цену">
            </div>
          
        `;
        n += 1
        pairContainer.appendChild(pairEntry);


        // Reinitialize autocomplete for new input
        const newInput = pairEntry.querySelector('input[name="pair"]');
        autocomplete(newInput, pairs);

        // Scroll to the new pair entry
        pairEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // // Focus on the new input field
        // newInput.focus();
    };

    // Add removePair function to window
    window.removePair = function (button) {
        const pairContainer = document.getElementById('pair-container');
        pairContainer.removeChild(button.closest('.pair-entry'));
    };
});
