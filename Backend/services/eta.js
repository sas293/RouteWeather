// Seconds from departure to each route coordinate, using ORS's road-aware durations.
// Within a step, time is spread by distance (not point count): geometry is dense on curves, sparse on highways.
export function computeArrivalTimes(distances, steps, totalDuration) {

    const totalDistance = distances.at(-1);

    // Fallback when ORS returns no steps: spread the route's total duration by distance.
    if (!steps?.length) {
        return distances.map(d => totalDistance > 0 ? (d / totalDistance) * totalDuration : 0);
    }

    const times = Array(distances.length).fill(0);

    // Steps are contiguous ([a,b], [b,c], ...), so times[startIdx] is already set by the previous step.
    for (const { way_points: [startIdx, endIdx], duration } of steps) {

        const stepDistance = distances[endIdx] - distances[startIdx];

        for (let i = startIdx + 1; i <= endIdx; i++) {

            const share = stepDistance > 0
                ? (distances[i] - distances[startIdx]) / stepDistance
                : (i - startIdx) / (endIdx - startIdx);

            times[i] = times[startIdx] + share * duration;
        }
    }

    return times;
}
