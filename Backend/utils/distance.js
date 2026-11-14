import haversine from 'haversine-distance';

export function computeCumulativeDistances(coords) {
    const distances = [0];

    for (let i = 1; i < coords.length; i++) {

        const prev = {
            lat: coords[i - 1][1],
            lon: coords[i - 1][0]
        };

        const curr = {
            lat: coords[i][1],
            lon: coords[i][0]
        };

        const distance = haversine(prev, curr);

        distances.push(
            distances[i - 1] + distance
        );
    }

    return distances;
}