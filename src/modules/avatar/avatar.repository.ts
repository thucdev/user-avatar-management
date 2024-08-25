import { AvatarEntity } from '@entities/avatar.entity';
import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract/abstract.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class AvatarRepository extends AbstractRepository<AvatarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AvatarEntity, dataSource);
  }
}
