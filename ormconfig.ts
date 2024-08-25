// import './src/boilerplate.polyfill';

import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'src/utils/snake-naming.strategy';

import { DataSource } from 'typeorm';

if (!(<any>module).hot /* for webpack HMR */) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}

dotenv.config({
  path: '.env',
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName]?.replace(/\\n/g, '\n');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/entities/*{.ts,.js}'],
  migrations: ['src/db/migrations/*{.ts,.js}'],
  synchronize: false,
});
