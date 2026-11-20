export class Cache {

    // Async so a network-backed cache (e.g. Redis) can implement the same interface.
    async get(key) {
        throw new Error('Cache.get() must be implemented');
    }

    async set(key, value, ttlMs) {
        throw new Error('Cache.set() must be implemented');
    }

}
