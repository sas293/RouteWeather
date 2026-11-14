export function computeArrivalTimes(coords, steps, distances) {

    if (!steps || !Array.isArray(steps)) {
        throw new Error('ORS steps missing or malformed.');
    }

    const orsArrival = Array(coords.length).fill(0);

    const avgSpeed = 11.89; // 50 km/h in m/s

    for (const step of steps) {

        const [startIdx, endIdx] = step.way_points;

        const stepLength = endIdx - startIdx;

        if (stepLength <= 0) continue;

        const durationPerStep =
            step.duration / stepLength;

        for ( let i = startIdx + 1; i <= endIdx; i++ ) {
            orsArrival[i] = orsArrival[i - 1] + durationPerStep;
        }
    }

    const distanceBased = distances.map( distance => distance / avgSpeed );

    const blended =
        orsArrival.map( (time, i) => (time + distanceBased[i]) / 2 );

    return blended;
}