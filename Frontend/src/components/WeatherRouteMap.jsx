import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  Cloud,
  CloudRain,
  Wind,
  Sun,
} from 'react-feather';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { color } from 'framer-motion';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Weather icon component
function getWeatherIconComponent(weather, size = 24, color = 'white') {
  const w = weather.toLowerCase();
  if (w.includes('rain')) return <CloudRain color={color} size={size} />;
  if (w.includes('cloud')) return <Cloud color={color} size={size} />;
  if (w.includes('wind')) return <Wind color={color} size={size} />;
  if (w.includes('sunny') || w.includes('clear')) return <Sun color={color} size={size} />;
  return <Sun color={color} size={size} />;
}

// DivIcon for weather emoji
function createWeatherIcon(weather) {
  let bgColor = '#facc15';
  const w = weather.toLowerCase();
  if (w.includes('rain')) bgColor = '#3b82f6';
  else if (w.includes('cloud')) bgColor = '#64748b';
  else if (w.includes('wind')) bgColor = '#fbbf24';

  let emoji = '☀️';
  if (w.includes('rain')) emoji = '🌧️';
  else if (w.includes('cloud')) emoji = '☁️';
  else if (w.includes('wind')) emoji = '🌬️';
  else if (w.includes('sunny') || w.includes('clear')) emoji = '☀️';

  const html = `
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: ${bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 5px rgba(0,0,0,0.3);
      border: 2px solid white;
      font-size: 22px;
      user-select: none;
      cursor: pointer;
    ">
      ${emoji}
    </div>
  `;

  return new L.DivIcon({
    html,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

// Start and end icons (from public folder)
const greenFlagIcon = new L.Icon({
  iconUrl: './src/assets/start.svg',
  iconSize: [40, 40],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const redFlagIcon = new L.Icon({
  iconUrl: './src/assets/end.svg',
  iconSize: [40, 40],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const WeatherRouteMap = ({ stops }) => {
  const path = stops.map(stop => [stop.lat, stop.lon]);

  return (
    <MapContainer
      center={[stops[0].lat, stops[0].lon]}
      zoom={7}
        style={{
        height: '600px',
        width: '100%',
        border: '6px solid #101828', // light green border
        borderRadius: '10px',         // optional: adds rounded corners
        }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stops.map((stop, idx) => {
        let icon;
        if (idx === 0) icon = greenFlagIcon;
        else if (idx === stops.length - 1) icon = redFlagIcon;
        else icon = createWeatherIcon(stop.forecast.weather);

        return (
          <Marker key={idx} position={[stop.lat, stop.lon]} icon={icon}>
            
              <Tooltip direction="right" offset={[10, 0]}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>{stop.town}</span>
              </Tooltip>
            

            <Popup>
              <div style={{ fontFamily: 'sans-serif', lineHeight: 1.5, textAlign: 'center' }}>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                  {getWeatherIconComponent(stop.forecast.weather, 48, '#facc15')}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: 12 }}>
                  {stop.town}
                </div>
                <div style={{ fontSize: '1rem', color: '#333' }}>
                  <div><strong>Arrival:</strong> {new Date(stop.arrival_time).toLocaleString()}</div>
                  <div><strong>Distance:</strong> {stop.distance_km} km</div>
                  <div><strong>Weather:</strong> {stop.forecast.weather}</div>
                  <div><strong>Temp:</strong> {stop.forecast.temperature} °C</div>
                  <div><strong>Wind:</strong> {stop.forecast.wind_speed} m/s</div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      <Polyline positions={path} color="green" weight={4} />
    </MapContainer>
  );
};

export default WeatherRouteMap;
