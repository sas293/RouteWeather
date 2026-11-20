const MAX_POINTS = 15;

const MIN_INTERVAL_S = 10 * 60;

const ROUND_TO_S = 5 * 60;

// Seconds of driving between stops: ~MAX_POINTS spread over the trip, rounded up to whole 5 minutes.
// Sampling by time (not distance) because forecasts change over time: a slow ghat/city stretch
// gets as many stops per hour as a fast highway.
export function getSamplingInterval(totalDurationSeconds) {
    const interval = Math.ceil(totalDurationSeconds / MAX_POINTS / ROUND_TO_S) * ROUND_TO_S;

    return Math.max(interval, MIN_INTERVAL_S);
}

// Picks the first point reached at or after each interval of travel time; start and end are always included.
export function samplePoints(coords, distances, times, interval) {
    const sampled = [];
    let nextTarget = interval;

    for (let i = 0; i < times.length; i++) {
        if (times[i] >= nextTarget) {
            sampled.push({
                coord: coords[i],
                distance: distances[i],
                index: i
            });

            // Skip targets already passed, so a long gap between points yields one stop, not duplicates.
            while (nextTarget <= times[i]) nextTarget += interval;
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
