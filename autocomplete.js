// import { allPairs } from './pairs.js';
// // function closeKeyboard() {
//     document.activeElement.blur();
// }
// export function autocomplete(inp, arr) {
//     var currentFocus;
//     inp.addEventListener("input", function (e) {
//         var a, b, i, val = this.value;
//         closeAllLists();
//         if (!val) { return false; }
//         currentFocus = -1;
//         a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         this.parentNode.appendChild(a);
//         let suggestionCount = 0;
//         for (i = 0; i < arr.length && suggestionCount < 10; i++) {
//             if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//                 b = document.createElement("DIV");
//                 b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
//                 b.innerHTML += arr[i].substr(val.length);
//                 b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
//                 b.addEventListener("click", function (e) {
//                     inp.value = this.getElementsByTagName("input")[0].value;
//                     closeAllLists();
//                 });
//                 a.appendChild(b);
//                 if (suggestionCount === 0) {
//                     addActive([b]); // Set the first suggestion as active
//                     b.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Scroll the first suggestion into view
//                 }
//                 suggestionCount++;
//             }
//         }
//     });

//     inp.addEventListener("keydown", function (e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//             currentFocus++;
//             addActive(x);
//         } else if (e.keyCode == 38) {
//             currentFocus--;
//             addActive(x);
//         } else if (e.keyCode == 13) {
//             e.preventDefault();
//             if (currentFocus > -1) {
//                 if (x) x[currentFocus].click();
//             }
//         }
//     });

//     function addActive(x) {
//         if (!x) return false;
//         removeActive(x);
//         if (currentFocus >= x.length) currentFocus = 0;
//         if (currentFocus < 0) currentFocus = (x.length - 1);
//         x[currentFocus].classList.add("autocomplete-active");
//     }

//     function removeActive(x) {
//         for (var i = 0; i < x.length; i++) {
//             x[i].classList.remove("autocomplete-active");
//         }
//     }

//     function closeAllLists(elmnt) {
//         var x = document.getElementsByClassName("autocomplete-items");
//         for (var i = 0; i < x.length; i++) {
//             if (elmnt != x[i] && elmnt != inp) {
//                 x[i].parentNode.removeChild(x[i]);
//             }
//         }
//     }

//     document.addEventListener("click", function (e) {
//         closeAllLists(e.target);
//     });
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     const pairs = await allPairs();

//     // Initialize autocomplete for all inputs with name 'pair'
//     const pairInputs = document.querySelectorAll('input[name="pair"]');
//     pairInputs.forEach(input => {
//         autocomplete(input, pairs);
//     });
// });


// Utility to close the keyboard
function closeKeyboard() {
    document.activeElement.blur();
}

// Autocomplete function
export function autocomplete(inp, arr) {
    let currentFocus;

    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) return false;

        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        let suggestionCount = 0;
        for (i = 0; i < arr.length && suggestionCount < 10; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
                suggestionCount++;
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");

        if (e.keyCode === 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode === 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode === 13) {
            e.preventDefault();
            if (currentFocus > -1 && x) x[currentFocus].click();
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// Main logic for autocomplete based on exchange and market
document.addEventListener('DOMContentLoaded', async () => {
    // Load exchange symbols from JSON
    const exchangeSymbols = await fetch('./exchangeSymbols.json').then(res => res.json());

    // Function to parse exchange input value
    const parseExchangeValue = (value) => {
        const [exchange, market] = value.split(' ');
        return { exchange: exchange.toLowerCase(), market: market === 'Spot' ? 'spot' : 'futures' };
    };

    // Add event listeners to exchange inputs
    const exchangeInputs = document.querySelectorAll('input[name="exchange"]');
    exchangeInputs.forEach(input => {
        input.addEventListener('change', () => {
            const { exchange, market } = parseExchangeValue(input.value);
            const symbols = exchangeSymbols[exchange]?.[market] || [];

            // Get the corresponding pair input field
            const pairInput = document.getElementById(`pair${input.id.replace('exchange', '')}`);
            if (pairInput) {
                autocomplete(pairInput, symbols);
            }
        });
    });
});
