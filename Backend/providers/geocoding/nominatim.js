import axios from 'axios';
import { GeocodingProvider } from './geocoding.js';
import { AppError } from '../../utils/AppError.js';

export class NominatimProvider extends GeocodingProvider {

   async reverseGeocode(lat, lon) {
    try {
        const response = await axios.get(
            'https://nominatim.openstreetmap.org/reverse',
            {
                params: {
                    lat,
                    lon,
                    format: 'json'
                },
                headers: {
                    'User-Agent': 'TripPlanner/1.0'
                }
            }
        );

        const address = response.data.address;

        return (
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            'Unknown'
        );

    } catch (error) {
        console.error('Nominatim API error:', error.message);

        throw new AppError(
            'Geocoding service is currently unavailable',
            502
        );
    }
}
}