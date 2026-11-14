export function getSamplingInterval(totalDistanceMeters) {
    const maxPoints = 15;

    let interval = totalDistanceMeters / maxPoints;

    if (interval < 10000) return 10000;
    if (interval < 20000) return 20000;
    if (interval < 30000) return 30000;

    return Math.ceil(interval / 10000) * 10000;
}

export function samplePoints(coords, distances, interval) {
    const sampled = [];
    let nextTarget = interval;

    for (let i = 0; i < distances.length; i++) {
        if (distances[i] >= nextTarget) {
            sampled.push({
                coord: coords[i],
                distance: distances[i],
                index: i
            });

            nextTarget += interval;
        }
    }

    // Always include start
    if (sampled[0]?.index !== 0) {
        sampled.unshift({
            coord: coords[0],
            distance: 0,
            index: 0
        });
    }

    // Always include end
    if (sampled.at(-1)?.index !== coords.length - 1) {
        sampled.push({
            coord: coords.at(-1),
            distance: distances.at(-1),
            index: coords.length - 1
        });
    }

    return sampled;
}