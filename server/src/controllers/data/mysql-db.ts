/// <reference types="@types/mysql" />

import * as mysql from 'mysql';

export interface RecordSnippet {
  [key: string]: any;
}

type TransformFn = (rows: any, fields: any) => any;

export const singleResult: TransformFn = (rows: any, fields: any): any =>
  rows[0] || null;

export class MySqlDbPool {
  private pool: mysql.Pool;

  constructor(private readonly config: string | mysql.PoolConfig) {
    this.pool = mysql.createPool(config);
  }

  public query(
    commandText: string,
    params: any[],
    transform: TransformFn | null = null
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, cn) => {
        if (err) {
          console.error('Problem getting connection:', err);
          reject(err);
        }

        cn.query(
          commandText,
          params,
          (
            error: mysql.MysqlError | null,
            rows?: any,
            fields?: mysql.FieldInfo[]
          ) => {
            if (error) {
              console.error('Error with query:', error, {
                commandText,
                params,
              });
              reject(error);
            } else {
              if (transform != null) {
                resolve(transform(rows, fields));
              }
              resolve({ rows, fields });
            }
          }
        );
      });
    });
  }

  public insert(table: string, obj: RecordSnippet): Promise<any> {
    const columnNames = Object.keys(obj).join(', ');
    const placeholders = Object.keys(obj)
      .map((n) => '?')
      .join(', ');
    const commandText = `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`;
    const values = Object.values(obj);
    return this.query(commandText, values);
  }

  public update(
    table: string,
    key: RecordSnippet,
    obj: RecordSnippet
  ): Promise<any> {
    const setters = Object.keys(obj)
      .map((col) => `${col} = ?`)
      .join(', ');
    const matchers = Object.keys(key)
      .map((col) => `${col} = ?`)
      .join(', ');
    const values = [...Object.values(obj), ...Object.values(key)];
    const commandText = `UPDATE ${table} SET ${setters} WHERE ${matchers}`;

    return this.query(commandText, values);
  }

  public delete(table: string, key: RecordSnippet): Promise<any> {
    const matchers = Object.keys(key)
      .map((col) => `${col} = ?`)
      .join(', ');
    const values = [...Object.values(key)];
    const commandText = `DELETE FROM ${table} WHERE ${matchers}`;

    return this.query(commandText, values, logTransformFn);
  }

  public selectByKey(table: string, key: RecordSnippet): Promise<any> {
    const matchers = Object.keys(key)
      .map((col) => `${col} = ?`)
      .join(' AND ');
    const commandText = `SELECT * FROM ${table} WHERE ${matchers} LIMIT 1`;
    const values = Object.values(key);
    return this.query(commandText, values, singleResult);
  }
}

const logTransformFn = (data: any): any => {
  console.log('QueryResult:', data);
  return data;
};
