import { OrsProvider } from '../providers/routing/ors.js';
import { OpenWeatherProvider } from '../providers/weather/openweather.js';
import { MemoryCache } from '../providers/cache/memory.js';

import { RouteService } from '../services/route.js';


const routingProvider = new OrsProvider();
const weatherProvider = new OpenWeatherProvider();
const cache = new MemoryCache();


export const routeService = new RouteService(
    routingProvider,
    weatherProvider,
    cache
);
