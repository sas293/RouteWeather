import axios from 'axios';
import { config } from '../../config/env.js';
import { RoutingProvider } from './routing.js';
import { AppError } from '../../utils/AppError.js';

// Fail fast instead of holding the request open if the upstream API hangs.
const UPSTREAM_TIMEOUT_MS = 5000;

export class OrsProvider extends RoutingProvider {

    async getRoute(start, end) {
    try {
        const response = await axios.post(
            'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
            {
                coordinates: [start, end]
            },
            {
                timeout: UPSTREAM_TIMEOUT_MS,
                headers: {
                    Authorization: config.orsApiKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error('ORS API error:', error.message); // not the full error: it contains the API key header

        throw new AppError(
            'Routing service is currently unavailable',
            502
        );
    }
}

}