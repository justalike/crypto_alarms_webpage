// get all current pairs from binance spot
export const allPairs = async () => {

    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const data = await response.json();
    const pairs = data.symbols;
    const symbols = pairs.map(pair => pair.symbol);
    return symbols
}