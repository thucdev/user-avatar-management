import { AbstractEntity } from '@common/abstract/abstract.entity';
import { UserDto } from '@common/dto/user.dto';
import { Column, Entity, Index, OneToOne } from 'typeorm';
import { AvatarEntity } from './avatar.entity';

@Entity()
@Index(['email'], { unique: true })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  externalId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @OneToOne(() => AvatarEntity, (avatar) => avatar.user)
  avatar: AvatarEntity;

  dtoClass = UserDto;
}
