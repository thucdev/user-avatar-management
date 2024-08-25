import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  ObjectId,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { v4 } from 'uuid';

export class AbstractRepository<Entity> extends Repository<Entity> {
  constructor(target: EntityTarget<Entity>, dataSource: DataSource) {
    super(target, dataSource.manager);
  }

  async softDelete(
    criteria:
      | string
      | number
      | Date
      | ObjectId
      | string[]
      | number[]
      | Date[]
      | ObjectId[]
      | FindOptionsWhere<Entity>,
  ): Promise<UpdateResult> {
    return super.update(criteria, {
      deletedAt: new Date(),
    } as any);
  }

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    Object.assign(partialEntity, {
      ...partialEntity,
    });
    return super.update(criteria, partialEntity);
  }

  save<S>(entities: S, options: SaveOptions & { reload: false }): Promise<S>;
  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
  ): Promise<T[]>;
  save<T extends DeepPartial<Entity>>(
    entities: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;
  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;
  save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
  ): Promise<T>;
  save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity>;
  save<T extends DeepPartial<Entity>>(
    entity,
    options?: unknown,
  ): Promise<T[]> | Promise<(T & Entity)[]> | Promise<T> | Promise<T & Entity> {
    entity = this.makeIds(entity);

    return super.save(entity, options);
  }

  makeIds(entity: Entity[] | Entity | any) {
    if (!Array.isArray(entity)) {
      return { ...entity, id: entity.id || v4() };
    }
    return entity.map((e) => ({ ...e, id: e.id || v4() }));
  }
}
