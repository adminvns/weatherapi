import React, { useEffect, useRef } from 'react';
import { setSkyconIcon } from './Skycons';

function WeatherCard({ weather, unit, setUnit, timezone }) {
  const canvasRef = useRef(null);
  // Visual Crossing response handling
  const temperature = weather.temp ?? 0; // Already Celsius
  const fahrenheit = (temperature * 9) / 5 + 32;
  const description = weather.conditions ?? 'No description';
  const humidity = weather.humidity ?? null;
  const windspeed = weather.windspeed ?? null;
  const pressure = weather.pressure ?? null;
  const cloudcover = weather.cloudcover ?? null;
  const sunrise = weather.sunrise ?? null;
  const sunset = weather.sunset ?? null;

  // Map Visual Crossing icon/conditions to Skycons for animation
  let icon = 'CLEAR_DAY';
  const cond = description.toLowerCase();
  if (cond.includes('clear') && cond.includes('night')) icon = 'CLEAR_NIGHT';
  else if (cond.includes('clear')) icon = 'CLEAR_DAY';
  else if (cond.includes('partly') && cond.includes('night')) icon = 'PARTLY_CLOUDY_NIGHT';
  else if (cond.includes('partly') || cond.includes('partial')) icon = 'PARTLY_CLOUDY_DAY';
  else if (cond.includes('cloud') && cond.includes('night')) icon = 'PARTLY_CLOUDY_NIGHT';
  else if (cond.includes('cloud')) icon = 'CLOUDY';
  else if (cond.includes('rain')) icon = 'RAIN';
  else if (cond.includes('snow')) icon = 'SNOW';
  else if (cond.includes('fog')) icon = 'FOG';
  else if (cond.includes('wind')) icon = 'WIND';
  else if (cond.includes('sleet')) icon = 'SLEET';

  useEffect(() => {
    if (canvasRef.current) {
      setSkyconIcon(icon, canvasRef.current);
    }
  }, [icon]);

  return (
    <div className="weather-card">
      <canvas ref={canvasRef} width="128" height="128" />
      <div style={{fontWeight:700, fontSize:'1.15rem', margin:'0.7rem 0 0.2rem 0', color:'#fff', textShadow:'0 1px 6px #222'}}>
        {(() => {
          if (timezone && typeof timezone === 'string') {
            // If timezone looks like coordinates, fallback to address or show 'Current Location'
            const first = timezone.split(',')[0].trim();
            if (/^-?\d+(\.\d+)?$/.test(first)) {
              // If address is also coordinates, show 'Current Location'
              if (weather.address && /^-?\d+(\.\d+)?$/.test(weather.address.split(',')[0].trim())) {
                return 'Current Location';
              }
              return weather.address ? weather.address.split(',')[0] : 'Current Location';
            }
            return first;
          }
          return weather.timezone || weather.address || '';
        })()}
      </div>
      <div className="temperature-section" onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}>
        <span className="temperature-degree">
          {unit === 'C' ? Math.round(temperature) : Math.round(fahrenheit)}
        </span>
        <span className="temperature-unit">{unit}</span>
      </div>
      <div className="temperature-description">{description}</div>
      <div style={{marginTop:'1.2rem', fontSize:'1rem', opacity:0.85}}>
        {humidity !== null && <div>Humidity: <b>{humidity}%</b></div>}
        {windspeed !== null && <div>Wind Speed: <b>{windspeed} km/h</b></div>}
        {pressure !== null && <div>Pressure: <b>{pressure} hPa</b></div>}
        {cloudcover !== null && <div>Cloud Cover: <b>{cloudcover}%</b></div>}
        {sunrise && <div>Sunrise: <b>{sunrise}</b></div>}
        {sunset && <div>Sunset: <b>{sunset}</b></div>}
      </div>
    </div>
  );
}

export default WeatherCard;
