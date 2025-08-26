const axios = require("axios");
const pool = require("../db");

// Note: Yahoo Finance API doesn't require an API key

// Stock symbols and their company names
const STOCK_SYMBOLS = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'LLY', name: 'Eli Lilly and Company' },
    { symbol: 'AVGO', name: 'Broadcom Inc.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'WMT', name: 'Walmart Inc.' },
    { symbol: 'UNH', name: 'UnitedHealth Group Incorporated' },
    { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
    { symbol: 'MA', name: 'Mastercard Incorporated' },
    { symbol: 'PG', name: 'Procter & Gamble Co.' },
    { symbol: 'HD', name: 'The Home Depot Inc.' },
    { symbol: 'CVX', name: 'Chevron Corporation' },
    { symbol: 'KO', name: 'The Coca-Cola Company' },
    { symbol: 'MRK', name: 'Merck & Co. Inc.' },
    { symbol: 'PFE', name: 'Pfizer Inc.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'ABT', name: 'Abbott Laboratories' },
    { symbol: 'ABBV', name: 'AbbVie Inc.' },
    { symbol: 'ACN', name: 'Accenture plc' },
    { symbol: 'AZN', name: 'AstraZeneca plc' },
    { symbol: 'BAC', name: 'Bank of America Corp.' },
    { symbol: 'BRK-B', name: 'Berkshire Hathaway Inc.' },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.' },
    { symbol: 'COIN', name: 'Coinbase Global Inc.' },
    { symbol: 'CMCSA', name: 'Comcast Corporation' },
    { symbol: 'CRWD', name: 'CrowdStrike Holdings Inc.' },
    { symbol: 'DHR', name: 'Danaher Corporation' },
    { symbol: 'GS', name: 'The Goldman Sachs Group Inc.' },
    { symbol: 'HON', name: 'Honeywell International Inc.' },
    { symbol: 'IBM', name: 'International Business Machines Corp.' },
    { symbol: 'INTC', name: 'Intel Corporation' },
    { symbol: 'LIN', name: 'Linde plc' },
    { symbol: 'MRVL', name: 'Marvell Technology Inc.' },
    { symbol: 'MCD', name: 'McDonald\'s Corporation' },
    { symbol: 'MDT', name: 'Medtronic plc' },
    { symbol: 'QQQ', name: 'Nasdaq Inc.' },
    { symbol: 'NVO', name: 'Novo Nordisk A/S' },
    { symbol: 'ORCL', name: 'Oracle Corporation' },
    { symbol: 'PLTR', name: 'Palantir Technologies Inc.' },
    { symbol: 'PM', name: 'Philip Morris International Inc.' },
    { symbol: 'HOOD', name: 'Robinhood Markets Inc.' },
    { symbol: 'CRM', name: 'Salesforce Inc.' },
    { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
    { symbol: 'MSTR', name: 'MicroStrategy Incorporated' },
    { symbol: 'GME', name: 'GameStop Corp.' }
];

// In-memory cache for stock prices
let stockPriceCache = new Map();
let lastUpdateTime = null;
let isPolling = false;

// Create stock_prices table if it doesn't exist
async function initializeStockPricesTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS stock_prices (
                id SERIAL PRIMARY KEY,
                symbol VARCHAR(10) NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                change_amount DECIMAL(10,2),
                change_percent DECIMAL(10,4),
                volume BIGINT,
                market_cap BIGINT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(symbol)
            );
        `;
        
        await pool.query(createTableQuery);
        console.log('Stock prices table initialized successfully');
    } catch (error) {
        console.error('Error initializing stock prices table:', error);
    }
}

// Fetch stock price from Yahoo Finance API (more reliable than Alpha Vantage)
async function fetchStockPrice(symbol) {
    try {
        // Use Yahoo Finance API which is more reliable and has better coverage
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
            params: {
                interval: '1d',
                range: '1d'
            },
            timeout: 10000 // 10 second timeout
        });

        const data = response.data;
        
        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            throw new Error(`No data available for ${symbol}`);
        }

        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];
        const timestamp = result.timestamp[result.timestamp.length - 1];
        
        if (!meta.regularMarketPrice) {
            throw new Error(`No price data available for ${symbol}`);
        }

        // Calculate change from previous close
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.previousClose || currentPrice;
        const changeAmount = currentPrice - previousClose;
        const changePercent = previousClose > 0 ? (changeAmount / previousClose) * 100 : 0;

        return {
            symbol: symbol,
            price: parseFloat(currentPrice.toFixed(2)),
            change_amount: parseFloat(changeAmount.toFixed(2)),
            change_percent: parseFloat(changePercent.toFixed(4)),
            volume: parseInt(meta.regularMarketVolume || 0),
            market_cap: parseInt(meta.marketCap || 0)
        };
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error.message);
        return null;
    }
}

// Update stock price in database
async function updateStockPriceInDb(stockData, companyName) {
    try {
        const query = `
            INSERT INTO stock_prices (symbol, company_name, price, change_amount, change_percent, volume, market_cap, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
            ON CONFLICT (symbol) 
            DO UPDATE SET 
                price = EXCLUDED.price,
                change_amount = EXCLUDED.change_amount,
                change_percent = EXCLUDED.change_percent,
                volume = EXCLUDED.volume,
                market_cap = EXCLUDED.market_cap,
                updated_at = CURRENT_TIMESTAMP
        `;
        
        await pool.query(query, [
            stockData.symbol,
            companyName,
            stockData.price,
            stockData.change_amount,
            stockData.change_percent,
            stockData.volume,
            stockData.market_cap
        ]);
        
        return true;
    } catch (error) {
        console.error(`Error updating stock price in database for ${stockData.symbol}:`, error);
        return false;
    }
}

// Poll all stock prices
async function pollAllStockPrices() {
    if (isPolling) {
        console.log('Stock price polling already in progress, skipping...');
        return;
    }

    isPolling = true;
    console.log('Starting stock price polling...');

    try {
        const results = [];
        const batchSize = 10; // Process 10 stocks at a time (Yahoo Finance is more reliable)
        
        for (let i = 0; i < STOCK_SYMBOLS.length; i += batchSize) {
            const batch = STOCK_SYMBOLS.slice(i, i + batchSize);
            
            // Process batch in parallel
            const batchPromises = batch.map(async (stock) => {
                const stockData = await fetchStockPrice(stock.symbol);
                if (stockData) {
                    await updateStockPriceInDb(stockData, stock.name);
                    stockPriceCache.set(stock.symbol, {
                        ...stockData,
                        company_name: stock.name,
                        updated_at: new Date().toISOString()
                    });
                    return stockData;
                }
                return null;
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults.filter(result => result !== null));
            
            // Add shorter delay between batches (Yahoo Finance is more reliable)
            if (i + batchSize < STOCK_SYMBOLS.length) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
            }
        }
        
        lastUpdateTime = new Date();
        console.log(`Stock price polling completed. Updated ${results.length} stocks.`);
        
        return results;
    } catch (error) {
        console.error('Error during stock price polling:', error);
    } finally {
        isPolling = false;
    }
}

// Load stock prices from database into cache
async function loadStockPricesFromDb() {
    try {
        const query = 'SELECT * FROM stock_prices ORDER BY symbol';
        const result = await pool.query(query);
        
        stockPriceCache.clear();
        result.rows.forEach(row => {
            stockPriceCache.set(row.symbol, {
                symbol: row.symbol,
                company_name: row.company_name,
                price: parseFloat(row.price),
                change_amount: parseFloat(row.change_amount || 0),
                change_percent: parseFloat(row.change_percent || 0),
                volume: parseInt(row.volume || 0),
                market_cap: parseInt(row.market_cap || 0),
                updated_at: row.updated_at.toISOString()
            });
        });
        
        console.log(`Loaded ${stockPriceCache.size} stock prices from database`);
    } catch (error) {
        console.error('Error loading stock prices from database:', error);
    }
}

// Get all stock prices
async function getAllStockPrices() {
    try {
        // If cache is empty, load from database
        if (stockPriceCache.size === 0) {
            await loadStockPricesFromDb();
        }
        
        const stockPrices = Array.from(stockPriceCache.values());
        return {
            success: true,
            data: stockPrices,
            last_update: lastUpdateTime,
            total_stocks: stockPrices.length
        };
    } catch (error) {
        console.error('Error getting all stock prices:', error);
        return {
            success: false,
            error: 'Failed to retrieve stock prices'
        };
    }
}

// Get stock price by symbol
async function getStockPriceBySymbol(symbol) {
    try {
        // If cache is empty, load from database
        if (stockPriceCache.size === 0) {
            await loadStockPricesFromDb();
        }
        
        const stockData = stockPriceCache.get(symbol.toUpperCase());
        if (!stockData) {
            return {
                success: false,
                error: `Stock symbol '${symbol}' not found`
            };
        }
        
        return {
            success: true,
            data: stockData
        };
    } catch (error) {
        console.error(`Error getting stock price for ${symbol}:`, error);
        return {
            success: false,
            error: 'Failed to retrieve stock price'
        };
    }
}

// Manual trigger for stock price update
async function triggerStockPriceUpdate() {
    try {
        const results = await pollAllStockPrices();
        return {
            success: true,
            message: `Stock prices updated successfully. Updated ${results?.length || 0} stocks.`,
            last_update: lastUpdateTime
        };
    } catch (error) {
        console.error('Error triggering stock price update:', error);
        return {
            success: false,
            error: 'Failed to update stock prices'
        };
    }
}

// Initialize the system
async function initializeStockPriceSystem() {
    try {
        await initializeStockPricesTable();
        await loadStockPricesFromDb();
        
        // Start daily polling (every 24 hours)
        setInterval(async () => {
            console.log('Running scheduled stock price update...');
            await pollAllStockPrices();
        }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        
        console.log('Stock price system initialized successfully');
    } catch (error) {
        console.error('Error initializing stock price system:', error);
    }
}

// Clear all stock prices from database and cache
async function clearAllStockPrices() {
    try {
        // Clear from database
        const deleteQuery = 'DELETE FROM stock_prices';
        await pool.query(deleteQuery);
        
        // Clear from cache
        stockPriceCache.clear();
        lastUpdateTime = null;
        
        console.log('All stock prices cleared successfully');
        return {
            success: true,
            message: 'All stock prices cleared successfully',
            cleared_at: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error clearing stock prices:', error);
        return {
            success: false,
            error: 'Failed to clear stock prices'
        };
    }
}

// Export functions
module.exports = {
    getAllStockPrices,
    getStockPriceBySymbol,
    triggerStockPriceUpdate,
    initializeStockPriceSystem,
    pollAllStockPrices,
    clearAllStockPrices
};