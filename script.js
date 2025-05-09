let priceChart;

document.getElementById('stockForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    await analyzeStock(symbol);
});

async function analyzeStock(symbol) {
    try {
        showLoading();
        
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=XVPGT1Y53084FR4V`);
        const data = await response.json();

        if (data['Error Message']) {
            throw new Error('Invalid stock symbol');
        }

        const timeSeriesData = data['Time Series (Daily)'];
        const prices = [];
        const dates = [];
        const volumes = [];

        // Process the data
        for (const [date, values] of Object.entries(timeSeriesData)) {
            dates.unshift(date);
            prices.unshift(parseFloat(values['4. close']));
            volumes.unshift(parseInt(values['6. volume']));
        }

        // Create price chart
        createPriceChart(dates, prices, symbol);

        // Perform technical analysis
        const analysis = performTechnicalAnalysis(prices, volumes);
        displayResults(analysis, symbol);

        // Fetch and display news
        await fetchAndDisplayNews(symbol);

    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

function createPriceChart(dates, prices, symbol) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    if (priceChart) {
        priceChart.destroy();
    }

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${symbol} Price`,
                data: prices,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${symbol} Price History`
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function performTechnicalAnalysis(prices, volumes) {
    const analysis = {
        currentPrice: prices[prices.length - 1],
        priceChange: ((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2] * 100).toFixed(2),
        sma20: calculateSMA(prices, 20),
        sma50: calculateSMA(prices, 50),
        rsi: calculateRSI(prices),
        volumeChange: ((volumes[volumes.length - 1] - volumes[volumes.length - 2]) / volumes[volumes.length - 2] * 100).toFixed(2),
        trend: determineTrend(prices),
        support: findSupport(prices),
        resistance: findResistance(prices)
    };

    return analysis;
}

function calculateSMA(prices, period) {
    const sma = [];
    for (let i = period - 1; i < prices.length; i++) {
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
    }
    return sma[sma.length - 1].toFixed(2);
}

function calculateRSI(prices, period = 14) {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period + 1; i++) {
        const difference = prices[prices.length - i] - prices[prices.length - i - 1];
        if (difference >= 0) {
            gains += difference;
        } else {
            losses -= difference;
        }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi.toFixed(2);
}

function determineTrend(prices) {
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    const currentPrice = prices[prices.length - 1];

    if (currentPrice > sma20 && sma20 > sma50) {
        return 'Strong Uptrend';
    } else if (currentPrice > sma20) {
        return 'Uptrend';
    } else if (currentPrice < sma20 && sma20 < sma50) {
        return 'Strong Downtrend';
    } else if (currentPrice < sma20) {
        return 'Downtrend';
    } else {
        return 'Sideways';
    }
}

function findSupport(prices) {
    const recentPrices = prices.slice(-20);
    return Math.min(...recentPrices).toFixed(2);
}

function findResistance(prices) {
    const recentPrices = prices.slice(-20);
    return Math.max(...recentPrices).toFixed(2);
}

function displayResults(analysis, symbol) {
    const resultsDiv = document.getElementById('analysisResults');
    resultsDiv.innerHTML = `
        <div class="analysis-item">
            <h3>Price Information</h3>
            <p>Current Price: $${analysis.currentPrice.toFixed(2)}</p>
            <p>Price Change: ${analysis.priceChange}%</p>
        </div>
        <div class="analysis-item">
            <h3>Moving Averages</h3>
            <p>20-day SMA: $${analysis.sma20}</p>
            <p>50-day SMA: $${analysis.sma50}</p>
        </div>
        <div class="analysis-item">
            <h3>Technical Indicators</h3>
            <p>RSI (14): ${analysis.rsi}</p>
            <p>Volume Change: ${analysis.volumeChange}%</p>
        </div>
        <div class="analysis-item">
            <h3>Trend Analysis</h3>
            <p>Current Trend: ${analysis.trend}</p>
            <p>Support Level: $${analysis.support}</p>
            <p>Resistance Level: $${analysis.resistance}</p>
        </div>
    `;
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

async function fetchAndDisplayNews(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=6T7N2XIOJP6N3CYL`);
        const data = await response.json();

        if (data.feed && data.feed.length > 0) {
            const newsContainer = document.getElementById('newsSection');
            newsContainer.innerHTML = '<h3>Latest News</h3>';
            
            const newsList = document.createElement('div');
            newsList.className = 'news-list';
            
            data.feed.slice(0, 5).forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <h4>${article.title}</h4>
                    <p class="news-summary">${article.summary}</p>
                    <div class="news-meta">
                        <span class="news-source">${article.source}</span>
                        <span class="news-time">${new Date(article.time_published).toLocaleDateString()}</span>
                    </div>
                    <a href="${article.url}" target="_blank" class="news-link">Read More</a>
                `;
                newsList.appendChild(newsItem);
            });
            
            newsContainer.appendChild(newsList);
        } else {
            document.getElementById('newsSection').innerHTML = '<h3>Latest News</h3><p>No news available for this stock.</p>';
        }
    } catch (error) {
        document.getElementById('newsSection').innerHTML = '<h3>Latest News</h3><p>Error fetching news data.</p>';
    }
}
