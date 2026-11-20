import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDepartureTime, MAX_DEPARTURE_AHEAD_MS } from '../utils/validation.js';

const now = Date.parse('2026-01-01T10:00:00Z');
const HOUR = 60 * 60 * 1000;

test('departure defaults to now when omitted', () => {
    assert.equal(parseDepartureTime(undefined, now), now);
    assert.equal(parseDepartureTime('', now), now);
});

test('accepts ISO times inside the forecast window', () => {
    assert.equal(parseDepartureTime('2026-01-02T06:00:00Z', now), Date.parse('2026-01-02T06:00:00Z'));
    assert.equal(parseDepartureTime(new Date(now - 5 * 60 * 1000).toISOString(), now), now - 5 * 60 * 1000);
});

test('rejects garbage, the past, and beyond the forecast window', () => {
    assert.equal(parseDepartureTime('tomorrow-ish', now), null);
    assert.equal(parseDepartureTime(new Date(now - HOUR).toISOString(), now), null);
    assert.equal(parseDepartureTime(new Date(now + MAX_DEPARTURE_AHEAD_MS + HOUR).toISOString(), now), null);
});
