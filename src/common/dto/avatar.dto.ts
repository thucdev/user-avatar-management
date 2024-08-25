import { AbstractDto } from '@common/dto/abstract.dto';
import { AvatarEntity } from '@entities/avatar.entity';

export class AvatarDto extends AbstractDto {
  constructor(avatar: AvatarEntity) {
    super(avatar);
    Object.assign(this, avatar);
  }
}
