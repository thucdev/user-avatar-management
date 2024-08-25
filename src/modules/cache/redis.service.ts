import Redis from 'ioredis';

import { Logger } from '@nestjs/common';
import { IRegisterRedisOption } from './redis.interface';

export class RedisService {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);
  private readonly REDIS_TTL = 300; // 300s
  constructor(options: IRegisterRedisOption) {
    console.log('options', options);
    if (options?.host) {
      this.redis = new Redis({
        host: options.host,
        port: options.port,
        password: options.password,
        db: options.db,
      });

      this.redis?.on('connect', () =>
        this.logger.log('[REDIS] Redis connected'),
      );
      this.redis?.on('error', (e) => {
        this.logger.error('[REDIS]', e);
      });
    } else {
      this.logger.log('Create redis connection failed');
    }
  }

  async get(key: string): Promise<string> {
    return this.redis?.get(key);
  }

  async store(
    key: string,
    data: string | number | Buffer,
    ttl = this.REDIS_TTL,
  ): Promise<string> {
    await this.redis?.set(key, data);
    if (ttl) {
      await this.redis?.expire(key, ttl);
    }
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.redis?.del(key);
  }
}
