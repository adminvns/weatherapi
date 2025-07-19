import React, { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('F');
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [lastSearchType, setLastSearchType] = useState('geo'); // 'geo' or 'manual'

  useEffect(() => {
    if (!searching && lastSearchType === 'geo') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
            const api = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}?unitGroup=metric&key=${API_KEY}&contentType=json`;
            fetch(api)
              .then(res => {
                if (!res.ok) throw new Error('API error');
                return res.json();
              })
              .then(data => setWeather(data))
              .catch(() => setError('Failed to fetch weather data (CORS or API error)'));
          },
          () => setError('Geolocation permission denied')
        );
      } else {
        setError('Geolocation not supported');
      }
    }
  }, [searching, lastSearchType]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualLocation.trim()) return;
    setSearching(true);
    setError(null);
    setWeather(null);
    setLastSearchType('manual');
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const api = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(manualLocation)}?unitGroup=metric&key=${API_KEY}&contentType=json`;
    fetch(api)
      .then(res => {
        if (res.status === 400) {
          throw new Error('Invalid location. Please enter a valid city name, address, or ZIP/postal code.');
        }
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        setWeather(data);
        setSearching(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch weather data (CORS or API error)');
        setSearching(false);
      });
  };

  return (
    <div className="app-container">
      <h1 style={{color:'#fff', fontWeight:800, fontSize:'2.2rem', letterSpacing:'2px', marginBottom:'0.5rem', textShadow:'0 1px 8px #222'}}>Your Location Weather</h1>
      <form onSubmit={handleManualSearch} style={{marginBottom:'1rem', display:'flex', gap:'0.5rem', justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
        <div style={{marginBottom:'0.3rem', fontSize:'0.98rem', color:'#ffd700', opacity:0.85}}>
          Tip: Enter a city name, full address, or valid ZIP/postal code (e.g. "London", "New York, NY", "10001")
        </div>
        <div style={{display:'flex', gap:'0.5rem'}}>
          <input
            type="text"
            placeholder="Enter city, address, or ZIP code"
            value={manualLocation}
            onChange={e => setManualLocation(e.target.value)}
            style={{padding:'0.5rem 1rem', fontSize:'1rem', borderRadius:'6px', border:'1px solid #ccc', minWidth:'220px'}}
          />
          <button type="submit" style={{padding:'0.5rem 1.2rem', fontSize:'1rem', borderRadius:'6px', background:'#ffd700', color:'#222', fontWeight:600, border:'none', cursor:'pointer'}}>Search</button>
        </div>
      </form>
      {error && <div className="error">{error}</div>}
      {weather && weather.currentConditions ? (
        <WeatherCard
          weather={weather.currentConditions}
          timezone={weather.resolvedAddress || weather.address || ''}
          unit={unit}
          setUnit={setUnit}
        />
      ) : !error && <div className="loading-spinner"></div>}
    </div>
  );
}

export default App;
