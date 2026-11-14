import axios from 'axios';
import { config } from '../../config/env.js';
import { RoutingProvider } from './routing.js';
import { AppError } from '../../utils/AppError.js';

export class OrsProvider extends RoutingProvider {

    async getRoute(start, end) {
    try {
        const response = await axios.post(
            'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
            {
                coordinates: [start, end]
            },
            {
                headers: {
                    Authorization: config.orsApiKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error('ORS API error:', error);

        throw new AppError(
            'Routing service is currently unavailable',
            502
        );
    }
}

}