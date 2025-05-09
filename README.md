# Stock Technical Analyzer

A web application that performs technical analysis on stocks using real-time market data.

## Features

- Real-time stock data visualization
- Technical analysis including:
  - Price information and changes
  - Moving Averages (20-day and 50-day SMA)
  - Relative Strength Index (RSI)
  - Volume analysis
  - Trend analysis
  - Support and resistance levels
- Interactive price chart
- Responsive design

## Setup

1. Clone this repository to your local machine
2. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
3. Open `script.js` and replace `YOUR_API_KEY` with your actual Alpha Vantage API key
4. Open `index.html` in your web browser

## Usage

1. Enter a stock symbol (e.g., AAPL for Apple, GOOGL for Google)
2. Click the "Analyze" button
3. View the price chart and technical analysis results

## Technical Analysis Indicators

The application calculates and displays the following technical indicators:

- **Price Information**: Current price and daily price change
- **Moving Averages**: 20-day and 50-day Simple Moving Averages (SMA)
- **RSI**: 14-day Relative Strength Index
- **Volume Analysis**: Daily volume changes
- **Trend Analysis**: Current market trend based on price and moving averages
- **Support/Resistance**: Key price levels based on recent price action

## Note

The free tier of Alpha Vantage API has rate limits (5 API calls per minute and 500 calls per day). For production use, consider upgrading to a paid plan. 