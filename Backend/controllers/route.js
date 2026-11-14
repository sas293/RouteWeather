import { routeService } from '../container/dependencies.js';
import { AppError } from '../utils/AppError.js';
import { parseCoordinates } from '../utils/validation.js';


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

        const results = await routeService.getRouteWeather(start,end);
        
        return res.json({ results });

    } catch (error) {
        next(error);
    }
}