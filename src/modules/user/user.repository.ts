import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract/abstract.repository';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource);
  }
}
