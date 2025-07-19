// netlify/functions/weather.js

exports.handler = async function(event) {
  const { location } = event.queryStringParameters;
  const API_KEY = process.env.WEATHER_API_KEY; // Set this in Netlify env vars
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  try {
    console.log('Weather function debug:');
    console.log('Location:', location);
    console.log('API_KEY:', API_KEY ? 'set' : 'NOT SET');
    console.log('Request URL:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Raw response:', text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.log('JSON parse error:', jsonErr);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Invalid JSON from weather API', details: text })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data', details: err.message })
    };
  }
};