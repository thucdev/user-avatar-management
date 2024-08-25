/* eslint-disable @typescript-eslint/tslint/config */
import {
  ApiProperty as apiProperty,
  ApiPropertyOptional as apiPropertyOptional,
  ApiResponseProperty as apiResponseProperty,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { Transform } from 'class-transformer';
import { splitObjectNameToString } from 'src/utils/utils.service';
import {
  ApiExceptionConfig,
  ApiPropertyConfig,
  ApiResponseConfig,
} from './api-info';
import { ObjectMap } from './object-map';

export function getType(target: any, key: string): string | undefined {
  return Reflect.getMetadata('design:type', target, key).name;
}

export function ApiResponseProperty(
  config: ApiResponseConfig,
): PropertyDecorator {
  return function (target, propertyKey) {
    if (!config.options) {
      config.options = {};
    }

    if (!config.type) {
      config.type = getType(target, propertyKey as string);
    }

    ObjectMap.sign({
      ...config,
      objectName: target.constructor.name,
      propertyName: propertyKey as string,
    });

    apiResponseProperty({
      ...config.options,
      example: config.example,
    })(target, propertyKey);
  };
}

export function ApiException(config: ApiExceptionConfig): PropertyDecorator {
  return function (target, propertyKey) {
    if (!config.options) {
      config.options = {};
    }
    ObjectMap.sign({
      ...config,
      objectName: target.constructor.name,
      propertyName: propertyKey as string,
    });

    apiResponseProperty({
      ...config.options,
      example: config.swaggerExample,
    })(target, propertyKey);
  };
}

export function ApiProperty(config: ApiPropertyConfig): PropertyDecorator {
  return function (target, propertyKey) {
    if (!config.decorators) {
      config.decorators = [];
    }
    if (!config.options) {
      config.options = {};
    }

    if (!config.type) {
      config.type = getType(target, propertyKey as string);
    }
    apiProperty({
      ...config.options,
      example: config.example,
    })(target, propertyKey);

    Transform(({ value }) =>
      typeof value === 'string' ? value.trim() : value,
    )(target, propertyKey);

    if (!config.constraint) {
      config.constraint = '';
    }

    for (const constraint of config.decorators) {
      if (constraint.name !== 'Type') {
        const handleConstraintName = splitObjectNameToString(constraint.name);
        config.constraint = config.constraint
          ? config.constraint + ' | ' + handleConstraintName
          : '' + handleConstraintName;
      }
      constraint()(target, propertyKey);
    }

    ObjectMap.sign({
      ...config,
      objectName: target.constructor.name,
      propertyName: propertyKey as string,
      isRequired: true,
    });
  };
}

export function ApiPropertyOptional(
  config: ApiPropertyConfig,
): PropertyDecorator {
  return function (target, propertyKey) {
    if (!config.decorators) {
      config.decorators = [];
    }
    if (!config.options) {
      config.options = {};
    }

    if (!config.type) {
      config.type = getType(target, propertyKey as string);
    }
    apiPropertyOptional({
      ...config.options,
      example: config.example,
    })(target, propertyKey);

    Transform(({ value }) =>
      typeof value === 'string' ? value.trim() : value,
    )(target, propertyKey);

    IsOptional()(target, propertyKey);

    for (const constraint of config.decorators) {
      if (constraint.name !== 'Type') {
        const handleConstraintName = splitObjectNameToString(constraint.name);
        config.constraint = config.constraint
          ? config.constraint + ' | ' + handleConstraintName
          : '' + handleConstraintName;
      }
      constraint()(target, propertyKey);
    }

    config.constraint = config.constraint
      ? config.constraint + ' | is optional'
      : 'is optional';

    ObjectMap.sign({
      ...config,
      objectName: target.constructor.name,
      propertyName: propertyKey as string,
      isRequired: false,
    });
  };
}

export function ClassExtends(extendsName: string): ClassDecorator {
  return function (target) {
    ObjectMap.extend(target.name, extendsName);
  };
}
