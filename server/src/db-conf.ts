import * as mysql from 'mysql';

export const databaseSettings:
  | mysql.ConnectionConfig
  | mysql.PoolSpecificConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
  port: 3308,
  connectTimeout: 100,
  connectionLimit: 10,
  timezone: 'UTC',
};
