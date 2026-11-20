import axios from 'axios';
import { config } from '../../config/env.js';
import { WeatherProvider } from './weather.js';
import { AppError } from '../../utils/AppError.js';

export class OpenWeatherProvider extends WeatherProvider {

  async getForecast(lat, lon, timestamp) {
    try {
        const response = await axios.get(
            'https://api.openweathermap.org/data/2.5/forecast',
            {
                params: {
                    lat,
                    lon,
                    appid: config.owmApiKey,
                    units: 'metric'
                }
            }
        );

        const forecasts = response.data.list;

        const closest = forecasts.reduce((prev, curr) => {
            return Math.abs(curr.dt * 1000 - timestamp) <
                   Math.abs(prev.dt * 1000 - timestamp)
                ? curr
                : prev;
        });

        return {
            // OWM already resolves the nearest locality, so no separate reverse-geocoding call is needed.
            town: response.data.city?.name || 'Unknown',
            temperature: closest.main.temp,
            weather: closest.weather[0].description,
            windSpeed: closest.wind.speed
        };

    } catch (error) {
        console.error('OpenWeather API error:', error.message);

        throw new AppError(
            'Weather service is currently unavailable',
            502
        );
    }
}

}