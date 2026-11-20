import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RouteService } from '../services/route.js';
import { MemoryCache } from '../providers/cache/memory.js';

// ~100 km straight line east along the equator, 0.1° apart
const coords = Array.from({ length: 10 }, (_, i) => [i * 0.1, 0]);
const fakeRoute = {
    features: [{
        geometry: { coordinates: coords },
        properties: { segments: [{ steps: [{ way_points: [0, 9], duration: 3600 }] }] }
    }]
};

function makeService() {
    const calls = { route: 0, weather: 0 };
    const routing = { getRoute: async () => { calls.route++; return fakeRoute; } };
    const weather = {
        getForecast: async () => {
            calls.weather++;
            return { town: 'Testville', temperature: 20, weather: 'clear sky', windSpeed: 3 };
        }
    };
    return { service: new RouteService(routing, weather, new MemoryCache()), calls };
}

test('returns weather for start, sampled points and end', async () => {
    const { service } = makeService();
    const results = await service.getRouteWeather([0, 0], [0.9, 0]);

    assert.ok(results.length >= 2);
    assert.equal(results[0].distance_km, '0.0');
    assert.equal(results[0].town, 'Testville');
    assert.deepEqual(results[0].forecast, { temperature: 20, weather: 'clear sky', windSpeed: 3 });
});

test('repeat request is served from cache', async () => {
    const { service, calls } = makeService();
    await service.getRouteWeather([0, 0], [0.9, 0]);
    const weatherCalls = calls.weather;

    await service.getRouteWeather([0, 0], [0.9, 0]);

    assert.equal(calls.route, 1);
    assert.equal(calls.weather, weatherCalls);
});

test('MemoryCache expires entries and evicts the oldest when full', async () => {
    const cache = new MemoryCache(2);
    await cache.set('a', 1, 60_000);
    await cache.set('b', 2, 60_000);
    await cache.set('c', 3, 60_000);
    assert.equal(await cache.get('a'), undefined);
    assert.equal(await cache.get('c'), 3);

    await cache.set('d', 4, -1);
    assert.equal(await cache.get('d'), undefined);
});

test('arrival times start at the given departure time', async () => {
    const { service } = makeService();
    const departAt = Date.parse('2026-06-01T06:00:00Z');
    const results = await service.getRouteWeather([0, 0], [0.9, 0], departAt);

    assert.equal(results[0].arrival_time, '2026-06-01T06:00:00.000Z');
    assert.equal(results.at(-1).arrival_time, '2026-06-01T07:00:00.000Z'); // fake route takes 3600 s
});
