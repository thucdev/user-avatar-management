import { DynamicModule, Module, OnModuleInit, Provider } from '@nestjs/common';

import { ConfigService } from '@shared/services/config.service';
import { REDIS_PROVIDE } from './redis.constant';
import { RedisService } from './redis.service';

@Module({})
export class CacheModule implements OnModuleInit {
  configService;

  public static register(): DynamicModule {
    const providers: Provider<any>[] = [
      {
        provide: REDIS_PROVIDE,
        useFactory: () =>
          new RedisService({
            host: new ConfigService().get('REDIS_HOST'),
            port: +new ConfigService().get('REDIS_PORT') || 6379,
            password: new ConfigService().get('REDIS_PASSWORD'),
            db: +new ConfigService().get('REDIS_DATABASE'),
          }),
      },
    ];

    return {
      module: CacheModule,
      providers: [...providers],
      exports: [...providers],
    };
  }

  public onModuleInit(): any {
    this.configService = new ConfigService();
  }
}
