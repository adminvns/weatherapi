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
  const [geoError, setGeoError] = useState(false);
  const [snack, setSnack] = useState("");

  useEffect(() => {
    if (!searching && lastSearchType === 'geo') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            const api = `/.netlify/functions/weather?location=${lat},${long}`;
            fetch(api)
              .then(res => {
                if (!res.ok) throw new Error('API error');
                return res.json();
              })
              .then(data => setWeather(data))
              .catch(() => setError('Failed to fetch weather data (CORS or API error)'));
            setGeoError(false);
          },
          () => {
            setError('Geolocation permission denied');
            setGeoError(true);
          }
        );
      } else {
        setError('Geolocation not supported');
      }
    }
  }, [searching, lastSearchType]);
  // Retry geolocation prompt
  const handleRetryGeolocation = () => {
    setError(null);
    setSnack("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          const api = `/.netlify/functions/weather?location=${lat},${long}`;
          fetch(api)
            .then(res => {
              if (!res.ok) throw new Error('API error');
              return res.json();
            })
            .then(data => {
              setWeather(data);
              setGeoError(false);
            })
            .catch(() => setError('Failed to fetch weather data (CORS or API error)'));
        },
        () => {
          setGeoError(true);
          // Show snack for mobile users
          if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setSnack("Hey, check your GPS is ON and location permission is allowed. Then request again or refresh the page.");
          }
        }
      );
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualLocation.trim()) return;
    setSearching(true);
    setError(null);
    setWeather(null);
    setLastSearchType('manual');
    const api = `/.netlify/functions/weather?location=${encodeURIComponent(manualLocation)}`;
    fetch(api)
      .then(res => {
        if (res.status === 400) {
          throw new Error('Error: Check your location again or Location unavailable at the moment');
        }
        if (!res.ok) throw new Error('Error: Check your location again or Location unavailable at the moment');
        return res.json();
      })
      .then(data => {
        setWeather(data);
        setSearching(false);
      })
      .catch((err) => {
        setError('Error: Check your location again or Location unavailable at the moment');
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
      {error && (
        <div className="error" style={{marginBottom:'0.7rem'}}>
          {error}
          {geoError && (
            <button onClick={handleRetryGeolocation} style={{marginLeft:'1rem', padding:'0.3rem 0.8rem', fontSize:'0.95rem', borderRadius:'5px', background:'#007bff', color:'#fff', border:'none', cursor:'pointer'}}>Request Location Again</button>
          )}
        </div>
      )}
      {snack && (
        <div style={{position:'fixed', bottom:'60px', left:'50%', transform:'translateX(-50%)', background:'#222', color:'#ffd700', padding:'0.7rem 1.2rem', borderRadius:'8px', fontSize:'1rem', zIndex:999, boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
          {snack}
        </div>
      )}
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
