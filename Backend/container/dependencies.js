import { OrsProvider } from '../providers/routing/ors.js';
import { OpenWeatherProvider } from '../providers/weather/openweather.js';
import { NominatimProvider } from '../providers/geocoding/nominatim.js';

import { RouteService } from '../services/route.js';


const routingProvider = new OrsProvider();
const weatherProvider = new OpenWeatherProvider();
const geocodingProvider = new NominatimProvider();


export const routeService = new RouteService(
    routingProvider,
    weatherProvider,
    geocodingProvider
);