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