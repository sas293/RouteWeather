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


export class RouteService {

    constructor(
        routingProvider,
        weatherProvider,
        geocodingProvider
    ) {
        this.routingProvider = routingProvider;
        this.weatherProvider = weatherProvider;
        this.geocodingProvider = geocodingProvider;
    }

    async getRouteWeather(start, end) {

        const routeData = await this.routingProvider.getRoute(start,end);

        const coords = routeData.features[0].geometry.coordinates;

        const steps = routeData.features[0].properties.segments[0]?.steps;


        // 1. Calculate cumulative distances

        const distances = computeCumulativeDistances(coords);

        const totalDistance =  distances.at(-1);


        // 2. Determine sampling interval

        const interval = getSamplingInterval(totalDistance);


        // 3. Sample route

        const sampled = samplePoints( coords,distances,interval);


        // 4. Calculate arrival times

        const allArrivalTimes = computeArrivalTimes( coords, steps, distances );


        const arrivalTimes = sampled.map( point => allArrivalTimes[point.index] );


        // 5. Fetch weather + location

        const now = Date.now();

        const results = [];

        for (let i = 0; i < sampled.length; i++) {

            const point = sampled[i];

            const [lon, lat] = point.coord;

            const timestamp = now + arrivalTimes[i] * 1000;


            const forecast = await this.weatherProvider.getForecast(lat,lon,timestamp);


            const location = await this.geocodingProvider.reverseGeocode(lat,lon);


            results.push({
                town: location,

                lat,
                lon,

                distance_km:
                    (point.distance / 1000)
                        .toFixed(1),

                arrival_time:
                    new Date(timestamp)
                        .toISOString(),

                forecast : forecast
            });
        }

        return results;
    }
}