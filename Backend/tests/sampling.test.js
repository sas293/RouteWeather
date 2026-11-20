import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSamplingInterval, samplePoints } from '../services/sampling.js';

const MIN = 60;

test('interval spreads ~15 stops over the trip, rounded up to 5 minutes, at least 10 minutes', () => {
    assert.equal(getSamplingInterval(195 * MIN), 15 * MIN); // 13 min -> 15
    assert.equal(getSamplingInterval(30 * MIN), 10 * MIN);  // short trip -> minimum
    assert.equal(getSamplingInterval(0), 10 * MIN);
});

test('samples by travel time: a slow stretch gets more stops than a fast one of equal length', () => {
    // 6 points, 10 km apart. First 30 km fast (10 min each), last 20 km slow (30 min each).
    const coords = [0, 1, 2, 3, 4, 5].map(x => [x, 0]);
    const distances = [0, 10, 20, 30, 40, 50].map(km => km * 1000);
    const times = [0, 10, 20, 30, 60, 90].map(m => m * MIN);

    const indexes = samplePoints(coords, distances, times, 30 * MIN).map(p => p.index);

    // Distance-based every 30 km would give [0, 3, 5]; time-based adds the slow stretch's midpoint.
    assert.deepEqual(indexes, [0, 3, 4, 5]);
});

test('a long gap between points yields one stop, not duplicates', () => {
    const coords = [[0, 0], [1, 0], [2, 0]];
    const indexes = samplePoints(coords, [0, 1, 2], [0, 100 * MIN, 101 * MIN], 10 * MIN).map(p => p.index);
    assert.deepEqual(indexes, [0, 1, 2]);
});

test('always includes start and end', () => {
    const indexes = samplePoints([[0, 0], [1, 0]], [0, 5], [0, 60], 10 * MIN).map(p => p.index);
    assert.deepEqual(indexes, [0, 1]);
});
