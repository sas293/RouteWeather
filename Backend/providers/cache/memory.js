import { Cache } from './cache.js';

// shortcut: per-process cache, not shared across instances; swap for a Redis Cache when scaling horizontally.
export class MemoryCache extends Cache {

    #store = new Map();

    constructor(maxEntries = 10000) {
        super();
        this.maxEntries = maxEntries;
    }

    async get(key) {
        const entry = this.#store.get(key);

        if (!entry) return undefined;

        if (Date.now() > entry.expiresAt) {
            this.#store.delete(key);
            return undefined;
        }

        return entry.value;
    }

    async set(key, value, ttlMs) {
        // Map keeps insertion order, so the first key is the oldest: evict it to bound memory.
        if (this.#store.size >= this.maxEntries && !this.#store.has(key)) {
            this.#store.delete(this.#store.keys().next().value);
        }

        this.#store.set(key, { value, expiresAt: Date.now() + ttlMs });
    }

}
