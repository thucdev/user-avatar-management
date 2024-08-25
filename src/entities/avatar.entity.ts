import { AbstractEntity } from '@common/abstract/abstract.entity';
import { AvatarDto } from '@common/dto/avatar.dto';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class AvatarEntity extends AbstractEntity<AvatarDto> {
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  imageHash: string;

  @Column()
  filePath: string;

  dtoClass = AvatarDto;
}
