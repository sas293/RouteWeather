export function parseCoordinates(coordinates) {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        return null;
    }

    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
        return null;
    }

    if (longitude < -180 || longitude > 180) {
        return null;
    }

    if (latitude < -90 || latitude > 90) {
        return null;
    }

    return [longitude, latitude];
}

// OWM's free forecast covers ~5 days ahead; cap departure at 4 so a long drive still lands inside it.
export const MAX_DEPARTURE_AHEAD_MS = 4 * 24 * 60 * 60 * 1000;

// Small grace so a "now" picked in the UI isn't rejected by the time the request arrives.
const PAST_GRACE_MS = 15 * 60 * 1000;

// Returns departure time in ms, `now` when omitted, or null when invalid / out of forecast range.
export function parseDepartureTime(value, now = Date.now()) {
    if (value === undefined || value === null || value === '') return now;

    const time = new Date(value).getTime();

    if (!Number.isFinite(time)) return null;

    if (time < now - PAST_GRACE_MS || time > now + MAX_DEPARTURE_AHEAD_MS) return null;

    return time;
}
