/// <reference types="@types/mysql" />

import { Request, Response } from 'express';
import { databaseSettings } from '../../db-conf';
import { HttpController } from './HttpController';
import { MySqlDbPool, singleResult } from './mysql-db';

export class DataAccessController extends HttpController {
  private db = new MySqlDbPool(databaseSettings);

  constructor(path = '/api') {
    super(path);

    this.registerRoute('GET', '', this.index);
    this.registerRoute('GET', ':table/schema', this.tableSchema);

    this.registerRoute('GET', ':table', this.selectAll);
    this.registerRoute('GET', ':table/:id', this.selectById);

    this.registerRoute('POST', ':table', this.insertRow);
    this.registerRoute('PUT', ':table/:id', this.updateRow);
    this.registerRoute('DELETE', ':table/:id', this.deleteRow);
  }

  index = (req: Request, res: Response) => {
    const commandText =
      'SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=DATABASE()';

    this.db
      .query(commandText, [])
      .then((data) =>
        res.send(Object.values(data.rows.map((row: any) => row.TABLE_NAME)))
      )
      .catch((error) => res.send(error));
  };

  tableSchema = (req: Request, res: Response) => {
    const commandText = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME = ?`;

    this.db
      .query(commandText, [req.params.table])
      .then(
        (data) => res.send(data.rows)

        // res.send(
        //   data.rows.map((row: any) => ({
        //     table: row.TABLE_NAME,
        //     column: row.COLUMN_NAME,
        //     type: row.COLUMN_TYPE,
        //     // row,
        //   }))
        // )
      )
      .catch((error) => res.send(error));
  };

  selectAll = (req: Request, res: Response) => {
    this.db
      .query(`SELECT * FROM ${req.params.table}`, [])
      .then((data) => res.send(data.rows))
      .catch((error) => res.send(error));
  };

  selectById = (req: Request, res: Response) => {
    this.db
      .query(
        `SELECT * FROM ${req.params.table} WHERE id=?`,
        [req.params.id],
        singleResult
      )
      .then((row) => {
        if (row) {
          res.send(row || null);
        } else {
          res.sendStatus(404);
        }
      })
      .catch((error) => res.send(error));
  };

  insertRow = (req: Request, res: Response) => {
    this.db
      .insert(req.params.table, req.body)
      .then((data) => {
        console.log('INSERT result:', JSON.stringify(data, null, 2));

        const insertId = data.rows.insertId || null;
        if (insertId) {
          this.db
            .selectByKey(req.params.table, { id: insertId })
            .then((inserted) => res.send(inserted))
            .catch(handlePromiseError(res));
        } else {
          res.send(data);
        }
      })
      .catch(handlePromiseError(res));
  };

  updateRow = (req: Request, res: Response) => {
    this.db
      .update(req.params.table, { id: req.params.id }, req.body)
      .then(() => {
        this.db
          .selectByKey(req.params.table, { id: req.params.id })
          .then((updated) => res.send(updated))
          .catch(handlePromiseError(res));
      })
      .catch(handlePromiseError(res));
  };

  deleteRow = (req: Request, res: Response) => {
    this.db
      .delete(req.params.table, { id: req.params.id })
      .then(() => res.sendStatus(200))
      .catch(handlePromiseError(res));
  };
}

const handlePromiseError = (res: Response) => (data: any) => {
  console.error('ERROR: ', data);
  res.statusCode = 500;
  res.send(data);
};

interface OkPacket {
  fieldCount: 0;
  affectedRows: 1;
  insertId: 37;
  serverStatus: 2;
  warningCount: 0;
  message: '';
  protocol41: true;
  changedRows: 0;
}
