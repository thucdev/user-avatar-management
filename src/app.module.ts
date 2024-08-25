import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AvatarsModule } from './modules/avatar/avatar.module';
import { UsersModule } from './modules/user/user.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
      async dataSourceFactory(options: any) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return new DataSource(options);
      },
    }),
    // CacheModule.register(),
    UsersModule,
    AvatarsModule,
  ],
})
export class AppModule {}
