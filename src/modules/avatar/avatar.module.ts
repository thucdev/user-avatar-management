// src/avatars/avatars.module.ts
import { RedisService } from '@modules/cache';
import { UsersModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarEntity } from 'src/entities/avatar.entity';
import { AvatarsController } from './avatar.controller';
import { AvatarRepository } from './avatar.repository';
import { AvatarsService } from './avatar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvatarEntity]),
    UsersModule,
    RedisService,
  ],
  controllers: [AvatarsController],
  providers: [AvatarsService, AvatarRepository],
})
export class AvatarsModule {}
