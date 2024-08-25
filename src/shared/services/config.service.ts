import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export class ConfigService {
  constructor() {
    dotenv.config({
      path: '.env',
    });
  }

  get isEnableSwagger(): boolean {
    return this.getEnvWithType('ENABLE_SWAGGER', 'boolean') || false;
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + '/../../entities/*{.ts,.js}'];
    let migrations = [__dirname + '/../../db/migrations/*{.ts,.js}'];

    if ((<any>module).hot) {
      const entityContext = (<any>require).context(
        './../../entities',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
      const migrationContext = (<any>require).context(
        './../../db/migrations',
        false,
        /\.ts$/,
      );
      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration;
      });
    }

    return {
      entities,
      migrations,
      keepConnectionAlive: true,
      type: 'postgres',
      host: this.get('DB_HOST'),
      port: this.getEnvWithType('DB_PORT', 'number'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_DATABASE'),
      schema: this.get('DB_SCHEMA'),
      migrationsRun: true,
      logging: 'all',
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: false,
    };
  }

  static get(key: string): string {
    return process.env[key] || '';
  }

  static mailerConfig() {
    return {
      transport: {
        host: this.get('SMTP_HOST'),
        secure: false,
        auth: {
          user: this.get('SMTP_USER'),
          pass: this.get('SMTP_PASS'),
        },
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    };
  }

  get(key: string): string {
    return process.env[key] || '';
  }

  getEnvWithType(key: string, type: string): any {
    switch (type) {
      case 'number':
        return Number(process.env[key]) || null;
      case 'boolean':
        return process.env[key] === 'true' || false;
      case 'array':
        return process.env[key]?.split(',') || [];
      default:
        return null;
    }
  }
}
