import { AbstractDto } from '@common/dto/abstract.dto';
import { UserEntity } from '@entities/user.entity';

export class UserDto extends AbstractDto {
  constructor(user: UserEntity) {
    super(user);
    Object.assign(this, user);
  }
}
