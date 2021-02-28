import * as mysql from 'mysql';

export const databaseSettings: mysql.ConnectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
  port: 3308,
};
