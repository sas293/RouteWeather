import { routeService } from '../container/dependencies.js';
import { AppError } from '../utils/AppError.js';
import { parseCoordinates, parseDepartureTime } from '../utils/validation.js';


export async function getIntermediateLocations( req , res , next ) {
    try {

        const start = parseCoordinates(req.body.start);
        const end = parseCoordinates(req.body.end);

        if (!start || !end) {
            throw new AppError(
                'Invalid coordinates. Expected [longitude, latitude].',
                400
            );
        }

        const departAt = parseDepartureTime(req.body.departAt);

        if (departAt === null) {
            throw new AppError(
                'Invalid departure time. It must be between now and 4 days ahead.',
                400
            );
        }

        const results = await routeService.getRouteWeather(start, end, departAt);
        
        return res.json({ results });

    } catch (error) {
        next(error);
    }
}