import {
    computeCumulativeDistances
} from '../utils/distance.js';

import {
    getSamplingInterval,
    samplePoints
} from './sampling.js';

import {
    computeArrivalTimes
} from './eta.js';


const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

const ROUTE_TTL_MS = 24 * 60 * 60 * 1000; // road geometry rarely changes

const WEATHER_TTL_MS = 30 * 60 * 1000; // OWM refreshes forecasts roughly every few hours


export class RouteService {

    constructor(
        routingProvider,
        weatherProvider,
        cache
    ) {
        this.routingProvider = routingProvider;
        this.weatherProvider = weatherProvider;
        this.cache = cache;
    }

    async #getForecastCached(lat, lon, timestamp) {

        // OWM forecasts come in 3-hour slots, so arrivals in the same slot at the same ~1 km cell share an entry.
        const slot = Math.round(timestamp / THREE_HOURS_MS);

        const key = `weather:${lat.toFixed(2)},${lon.toFixed(2)}:${slot}`;

        const hit = await this.cache.get(key);

        if (hit !== undefined) return hit;

        const forecast = await this.weatherProvider.getForecast(lat, lon, timestamp);

        await this.cache.set(key, forecast, WEATHER_TTL_MS);

        return forecast;
    }

    async getRouteWeather(start, end, departAt = Date.now()) {

        const routeKey = `route:${start.join(',')}:${end.join(',')}`;

        let route = await this.cache.get(routeKey);

        if (route === undefined) {
            const { geometry, properties } = (await this.routingProvider.getRoute(start, end)).features[0];

            // Cache only what the pipeline reads, not the full ORS response (instructions, names, metadata),
            // so each LRU entry stays small and many more routes fit in memory.
            route = {
                coords: geometry.coordinates,
                steps: properties.segments?.[0]?.steps?.map(({ way_points, duration }) => ({ way_points, duration })),
                duration: properties.summary?.duration ?? 0
            };

            await this.cache.set(routeKey, route, ROUTE_TTL_MS);
        }

        const { coords, steps, duration } = route;


        // 1. Calculate cumulative distances

        const distances = computeCumulativeDistances(coords);

        // 2. Calculate arrival time (seconds from departure) at every route point

        const allArrivalTimes = computeArrivalTimes(distances, steps, duration);


        // 3. Sample route by travel time

        const interval = getSamplingInterval(allArrivalTimes.at(-1));

        const sampled = samplePoints(coords, distances, allArrivalTimes, interval);


        const arrivalTimes = sampled.map( point => allArrivalTimes[point.index] );


        // 4. Fetch weather for all points in parallel (cached per ~1 km cell and 3-hour forecast slot).
        // allSettled: one failed stop must not discard the others' forecasts.

        const timestamps = sampled.map((point, i) => departAt + arrivalTimes[i] * 1000);

        const settled = await Promise.allSettled(sampled.map((point, i) => {
            const [lon, lat] = point.coord;
            return this.#getForecastCached(lat, lon, timestamps[i]);
        }));

        // Every stop failed = the weather service is down: surface its error (502) instead of an empty-looking trip.
        if (settled.every(s => s.status === 'rejected')) {
            throw settled[0].reason;
        }

        return sampled.map((point, i) => {

            const [lon, lat] = point.coord;

            const timestamp = timestamps[i];

            const { status, value } = settled[i];

            // A failed stop keeps its place, ETA and distance; only its forecast is missing.
            const { town = 'Unknown', ...forecast } = status === 'fulfilled' ? value : {};

            return {
                town,

                lat,
                lon,

                distance_km:
                    (point.distance / 1000)
                        .toFixed(1),

                arrival_time:
                    new Date(timestamp)
                        .toISOString(),

                forecast: status === 'fulfilled' ? forecast : null
            };
        });
    }
}