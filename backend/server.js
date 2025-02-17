const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors'); // Import cors
const app = express();

// Use cors middleware to enable CORS for all routes
app.use(cors());

// Define a User-Agent to use in requests
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';

app.get('/scrape-fund-rate', async (req, res) => {
  try {
    // Fetch the web page containing the Capital Fixed Income Fund rate
    const capitalResponse = await axios.get('https://www.makmur.id/id/reksadana/pendapatan-tetap/capital-fixed-income-fund-09e63e2f2630', {
      headers: { 'User-Agent': userAgent }
    });
    const capitalData = cheerio.load(capitalResponse.data);
    const capitalRateText = capitalData('.i16srfg8').eq(5).find('.t1fc9lxw').eq(1).text();
    const capitalRate = parseFloat(capitalRateText.replace('+', '').replace(',', '.').replace('%', ''));

    // Fetch the web page containing the Sucorinvest Monthly Income Fund rate
    const sucorinvestResponse = await axios.get('https://www.makmur.id/id/reksadana/pendapatan-tetap/sucorinvest-monthly-income-fund-8717da0cc7a0', {
      headers: { 'User-Agent': userAgent }
    });
    const sucorinvestData = cheerio.load(sucorinvestResponse.data);
    const sucorinvestRateText = sucorinvestData('.i16srfg8').eq(5).find('.t1fc9lxw').eq(1).text();
    const sucorinvestRate = parseFloat(sucorinvestRateText.replace('+', '').replace(',', '.').replace('%', ''));

    // Fetch the web page containing the Avrist Prime Income Fund rate
    const avristResponse = await axios.get('https://www.makmur.id/id/reksadana/pendapatan-tetap/avrist-prime-income-fund-3518eb1f993d', {
      headers: { 'User-Agent': userAgent }
    });
    const avristData = cheerio.load(avristResponse.data);
    const avristRateText = avristData('.i16srfg8').eq(5).find('.t1fc9lxw').eq(1).text();
    const avristRate = parseFloat(avristRateText.replace('+', '').replace(',', '.').replace('%', ''));

    // Fetch the web page containing the Insight Money fund rate
    const insightResponse = await axios.get('https://www.makmur.id/id/reksadana/pasar-uang/insight-money-20ff31c73b9a', {
      headers: { 'User-Agent': userAgent }
    });
    const insightData = cheerio.load(insightResponse.data);
    const insightRateText = insightData('.i16srfg8').eq(5).find('.t1fc9lxw').eq(1).text();
    const insightRate = parseFloat(insightRateText.replace('+', '').replace(',', '.').replace('%', ''));

    // Respond with the rates as JSON
    res.json({
      capitalFixedIncomeRate: capitalRate,
      sucorinvestMonthlyIncomeRate: sucorinvestRate,
      avristPrimeIncomeRate: avristRate,
      insightMoneyRate: insightRate
    });
  } catch (error) {
    console.error('Error fetching fund rates:', error);
    res.status(500).json({ error: 'Error fetching fund rates' });
  }
});

// Start the server on port 3001
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
