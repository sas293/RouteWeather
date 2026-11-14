export class WeatherProvider {

    async getForecast(lat, lon, timestamp) {
        throw new Error('WeatherProvider.getForecast() must be implemented');
    }

}