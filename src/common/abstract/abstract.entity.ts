import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UtilsService } from '../../utils/utils.service';
import { AbstractDto } from '../dto/abstract.dto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    name: 'deleted_at',
  })
  deletedAt: Date;

  @Column({ nullable: true })
  deletedBy: string;

  abstract dtoClass: new (entity?: AbstractEntity, options?: any) => T;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toDto?(options?: any) {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
