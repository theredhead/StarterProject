/// <reference types="@types/mysql" />

import { compileDirectiveFromMetadata } from '@angular/compiler';
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
      // this.pool.getConnection((err, cn) => {
      //   if (err) {
      //     console.error('Problem getting connection:', err);
      //     reject(err);
      //   }

      this.pool.query(
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
    // });
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

  public ifTableExists(
    name: string,
    commandText: string,
    params: any[],
    transform: TransformFn
  ) {
    return this.query(
      'SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? LIMIT 1',
      [name]
    ).then((rows: any[]) => {
      if (rows.length) {
        this.query(commandText, params, transform);
      }
    });
  }

  public ifNotTableExists(
    name: string,
    commandText: string,
    params: any[],
    transform: TransformFn
  ) {
    return this.query(
      'SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? LIMIT 1',
      [name]
    ).then((rows: any[]) => {
      if (rows.length === 0) {
        this.query(commandText, params, transform);
      }
    });
  }

  public async doesTableExists(name: string): Promise<boolean> {
    try {
      const rows = await this.query(
        'SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? LIMIT 1',
        [name]
      );
      return rows.length === 1;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public createTable(
    name: string,
    columns: ColumnDefinition[],
    autoId: boolean = true
  ): Promise<any> {
    const actualColumns: ColumnDefinition[] = autoId
      ? [
          {
            name: 'id',
            type: 'BIGINT NOT NULL AUTO_INCREMENT',
            primaryKey: true,
          },
          ...columns,
        ]
      : columns;

    const formattedColumns = actualColumns
      .map((c) => `${c.name} ${c.type}`)
      .join(', ');
    const primaryKey = actualColumns
      .filter((c) => c.primaryKey)
      .map((c) => c.name)
      .join(', ');

    const sql = `CREATE TABLE ${name} (${formattedColumns}, PRIMARY KEY(${primaryKey}))`;
    return this.query(sql, []);
  }
}

const logTransformFn = (data: any): any => {
  console.log('QueryResult:', data);
  return data;
};

interface ColumnDefinition {
  name: string;
  type: string;
  primaryKey?: boolean;
}
