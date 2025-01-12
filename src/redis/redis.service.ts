import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, serializedValue, "EX", ttl); // Set with expiration
    } else {
      await this.redisClient.set(key, serializedValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }
  async exists(key: string): Promise<boolean> {
    const count = await this.redisClient.exists(key);
    return count > 0;
  }

  async flushAll(): Promise<void> {
    await this.redisClient.flushall();
  }
}
