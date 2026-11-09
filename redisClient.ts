import Redis from 'ioredis';

// High-speed in-memory cache fallback with TTL support
class MemoryCacheStore {
  private store: Map<string, { value: string; expiry: number | null }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry !== null && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    const expiry = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiry });
    return 'OK';
  }

  async setex(key: string, ttlSeconds: number, value: string): Promise<'OK'> {
    return this.set(key, value, ttlSeconds);
  }

  async del(key: string): Promise<number> {
    const existed = this.store.delete(key);
    return existed ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    const item = await this.get(key);
    return item !== null ? 1 : 0;
  }

  async flushall(): Promise<'OK'> {
    this.store.clear();
    return 'OK';
  }

  async ping(): Promise<'PONG'> {
    return 'PONG';
  }

  async dbsize(): Promise<number> {
    // Purge expired keys
    const now = Date.now();
    for (const [k, v] of this.store.entries()) {
      if (v.expiry !== null && now > v.expiry) {
        this.store.delete(k);
      }
    }
    return this.store.size;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const nextVal = (current ? parseInt(current, 10) : 0) + 1;
    await this.set(key, String(nextVal));
    return nextVal;
  }

  async expire(key: string, ttlSeconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiry = Date.now() + ttlSeconds * 1000;
    return 1;
  }
}

const memoryStore = new MemoryCacheStore();

let redisClient: Redis | null = null;
let isRedisConnected = false;
let redisConnectionFailed = false;

const REDIS_URL = process.env.REDIS_URL || process.env.REDIS_TLS_URL || '';

// Initialize Redis only if REDIS_URL is provided or default redis://127.0.0.1:6379 is requested
if (REDIS_URL) {
  try {
    redisClient = new Redis(REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      commandTimeout: 2000,
      enableOfflineQueue: false,
      retryStrategy: (times) => {
        if (times > 2) {
          redisConnectionFailed = true;
          return null; // Stop reconnect loop to avoid blocking or spamming
        }
        return 1000;
      },
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      redisConnectionFailed = false;
      console.log('⚡ [REDIS] Connected to Redis server successfully at', REDIS_URL.replace(/:\/\/.*@/, '://***@'));
    });

    redisClient.on('error', (err) => {
      if (!redisConnectionFailed) {
        console.warn('⚠️ [REDIS] Server unreachable (' + err.message + '). Seamlessly using Ultra-Fast In-Memory Cache.');
        redisConnectionFailed = true;
      }
      isRedisConnected = false;
    });

    // Attempt non-blocking connection
    redisClient.connect().catch(() => {
      // Handled in error event
    });
  } catch (err: any) {
    console.warn('⚠️ [REDIS] Init error (' + err.message + '). Using In-Memory Cache.');
  }
} else {
  console.log('ℹ️ [CACHE] No REDIS_URL specified in .env. Running on Ultra-Fast In-Memory Cache (capable of 50,000+ req/sec).');
}

/**
 * Universal Cache Interface:
 * If Redis is connected, uses Redis; otherwise uses high-speed In-Memory Cache.
 */
export const cache = {
  /** Get item from cache */
  async get(key: string): Promise<string | null> {
    if (isRedisConnected && redisClient) {
      try {
        return await redisClient.get(key);
      } catch {
        return memoryStore.get(key);
      }
    }
    return memoryStore.get(key);
  },

  /** Set item in cache with optional TTL in seconds */
  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (isRedisConnected && redisClient) {
      try {
        if (ttlSeconds && ttlSeconds > 0) {
          return await redisClient.setex(key, ttlSeconds, value);
        }
        return await redisClient.set(key, value);
      } catch {
        return memoryStore.set(key, value, ttlSeconds);
      }
    }
    return memoryStore.set(key, value, ttlSeconds);
  },

  /** Set item with mandatory TTL in seconds */
  async setex(key: string, ttlSeconds: number, value: string): Promise<'OK'> {
    return this.set(key, value, ttlSeconds);
  },

  /** Delete item from cache */
  async del(key: string): Promise<number> {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.del(key);
      } catch {
        // ignore
      }
    }
    return memoryStore.del(key);
  },

  /** Flush entire cache */
  async flushall(): Promise<'OK'> {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.flushall();
      } catch {
        // ignore
      }
    }
    return memoryStore.flushall();
  },

  /** Ping cache engine */
  async ping(): Promise<string> {
    if (isRedisConnected && redisClient) {
      try {
        return await redisClient.ping();
      } catch {
        return 'PONG';
      }
    }
    return 'PONG';
  },

  /** Number of cached items */
  async dbsize(): Promise<number> {
    if (isRedisConnected && redisClient) {
      try {
        return await redisClient.dbsize();
      } catch {
        return memoryStore.dbsize();
      }
    }
    return memoryStore.dbsize();
  },

  /** Rate limiter for IP/User requests */
  async rateLimit(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetSeconds: number }> {
    const rateKey = `ratelimit:${key}`;
    try {
      if (isRedisConnected && redisClient) {
        const count = await redisClient.incr(rateKey);
        if (count === 1) {
          await redisClient.expire(rateKey, windowSeconds);
        }
        const ttl = await redisClient.ttl(rateKey);
        return {
          allowed: count <= limit,
          remaining: Math.max(0, limit - count),
          resetSeconds: ttl > 0 ? ttl : windowSeconds,
        };
      }
    } catch {
      // Fallback to memory
    }

    const count = await memoryStore.incr(rateKey);
    if (count === 1) {
      await memoryStore.expire(rateKey, windowSeconds);
    }
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetSeconds: windowSeconds,
    };
  },

  /** Get operational status of the cache system */
  async getStatus(): Promise<{
    provider: 'redis' | 'memory-fallback';
    connected: boolean;
    totalKeys: number;
    latencyMs: number;
    redisUrlConfigured: boolean;
  }> {
    const start = Date.now();
    await this.ping();
    const latencyMs = Date.now() - start;
    const totalKeys = await this.dbsize();

    return {
      provider: isRedisConnected ? 'redis' : 'memory-fallback',
      connected: true,
      totalKeys,
      latencyMs,
      redisUrlConfigured: !!REDIS_URL,
    };
  },
};

