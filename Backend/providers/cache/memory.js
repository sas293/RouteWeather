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

        // LRU: re-insert on every hit so the Map's insertion order becomes recency order.
        this.#store.delete(key);
        this.#store.set(key, entry);

        return entry.value;
    }

    async set(key, value, ttlMs) {
        // An overwrite counts as a use: drop the old position so the key moves to the most-recent end.
        this.#store.delete(key);

        // The first key in the Map is the least recently used: evict it to bound memory.
        if (this.#store.size >= this.maxEntries) {
            this.#store.delete(this.#store.keys().next().value);
        }

        this.#store.set(key, { value, expiresAt: Date.now() + ttlMs });
    }

}
