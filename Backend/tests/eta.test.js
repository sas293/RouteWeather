import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeArrivalTimes } from '../services/eta.js';

test('spreads step duration by distance, not by point count', () => {
    // 3 points in one step: first leg 10 m, second leg 90 m, 100 s total
    const times = computeArrivalTimes([0, 10, 100], [{ way_points: [0, 2], duration: 100 }], 100);
    assert.deepEqual(times, [0, 10, 100]);
});

test('accumulates across steps and ignores the zero-length arrival step', () => {
    const steps = [
        { way_points: [0, 1], duration: 60 },
        { way_points: [1, 2], duration: 30 },
        { way_points: [2, 2], duration: 0 }
    ];
    assert.deepEqual(computeArrivalTimes([0, 1000, 2000], steps, 90), [0, 60, 90]);
});

test('falls back to total duration when steps are missing', () => {
    assert.deepEqual(computeArrivalTimes([0, 50, 100], undefined, 200), [0, 100, 200]);
});
