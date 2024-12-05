

const endpoints = {
    binance: {
        spot: 'https://api.binance.com/api/v3/exchangeInfo',
        futures: 'https://fapi.binance.com/fapi/v1/exchangeInfo',
    },
    okx: {
        spot: 'https://www.okx.com/api/v5/market/tickers?instType=SPOT',
        futures: 'https://www.okx.com/api/v5/market/tickers?instType=SWAP',
    },
    bybit: {
        spot: 'https://api.bybit.com/v5/market/tickers?category=spot',
        futures: 'https://api.bybit.com/v5/market/tickers?category=linear',
    },
    bingx: {
        spot: 'https://api.bingx.com/api/v1/market/symbols',
        futures: 'https://open-api.bingx.com/openApi/swap/v2/quote/contracts',
    },
    bitget: {
        spot: 'https://api.bitget.com/api/spot/v1/public/products',
        futures: 'https://api.bitget.com/api/mix/v1/market/contracts?productType=umcbl',
    },
    mexc: {
        spot: 'https://api.mexc.com/api/v3/exchangeInfo',
        futures: 'https://contract.mexc.com/api/v1/contract/detail',
    },
};

const parseSymbols = (exchange, marketType, data) => {
    switch (exchange) {
        case 'binance':
            return data.symbols.map((pair) => pair.symbol);

        case 'okx':
            return data.data.map((pair) => pair.instId);

        case 'bybit':
            return data.result.list.map((pair) => pair.symbol);

        case 'bingx':
            return marketType === 'spot'
                ? data.data.result.map((pair) => pair.ticker_id.replace('-', ''))
                : data.data.map((pair) => pair.symbol.replace('-', ''));

        case 'bitget':
            return data.data.map((pair) => pair.symbol.replace('_SPBL', '') || pair.contracts.replace('_UMCBL', ''));

        case 'mexc':
            return marketType === 'spot'
                ? data.symbols.map((pair) => pair.symbol)
                : data.data.map((pair) => pair.symbol);

        default:
            return [];
    }
};

const fetchSymbols = async (exchange, marketType) => {
    try {
        const url = endpoints[exchange][marketType];
        const response = await fetch(url);
        const data = await response.json();
        return parseSymbols(exchange, marketType, data);
    } catch (error) {
        console.error(`Failed to fetch symbols for ${exchange} (${marketType}):`, error.message);
        return [];
    }
};

// const main = async () => {
//     const results = {};

//     for (const exchange in endpoints) {
//         results[exchange] = {};

//         for (const marketType in endpoints[exchange]) {
//             const symbols = await fetchSymbols(exchange, marketType);
//             results[exchange][marketType] = symbols;
//         }
//     }

//     await fs.writeFile('exchangeSymbols.json', JSON.stringify(results, null, 2));
//     console.log('Fetched symbols saved to exchangeSymbols.json');
// };

// main();
