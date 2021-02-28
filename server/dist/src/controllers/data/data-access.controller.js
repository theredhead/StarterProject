"use strict";
/// <reference types="@types/mysql" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAccessController = void 0;
const db_conf_1 = require("../../../db-conf");
const HttpController_1 = require("./HttpController");
const mysql_db_1 = require("./mysql-db");
class DataAccessController extends HttpController_1.HttpController {
    constructor(path = '/api') {
        super(path);
        this.db = new mysql_db_1.MySqlDbPool(db_conf_1.databaseSettings);
        this.index = (req, res) => {
            const commandText = 'SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=DATABASE()';
            this.db
                .query(commandText, [])
                .then((data) => res.send(Object.values(data.rows.map((row) => row.TABLE_NAME))))
                .catch((error) => res.send(error));
        };
        this.tableSchema = (req, res) => {
            const commandText = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME = ?`;
            this.db
                .query(commandText, [req.params.table])
                .then((data) => res.send(data.rows.map((row) => ({
                table: row.TABLE_NAME,
                column: row.COLUMN_NAME,
                type: row.COLUMN_TYPE,
                // row,
            }))))
                .catch((error) => res.send(error));
        };
        this.selectAll = (req, res) => {
            this.db
                .query(`SELECT * FROM ${req.params.table}`, [])
                .then((data) => res.send(data.rows))
                .catch((error) => res.send(error));
        };
        this.selectById = (req, res) => {
            this.db
                .query(`SELECT * FROM ${req.params.table} WHERE id=?`, [req.params.id], mysql_db_1.singleResult)
                .then((row) => {
                if (row) {
                    res.send(row || null);
                }
                else {
                    res.sendStatus(404);
                }
            })
                .catch((error) => res.send(error));
        };
        this.insertRow = (req, res) => {
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
                }
                else {
                    res.send(data);
                }
            })
                .catch(handlePromiseError(res));
        };
        this.updateRow = (req, res) => {
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
        this.deleteRow = (req, res) => {
            this.db
                .delete(req.params.table, { id: req.params.id })
                .then(() => res.sendStatus(200))
                .catch(handlePromiseError(res));
        };
        this.registerRoute('GET', '', this.index);
        this.registerRoute('GET', ':table/schema', this.tableSchema);
        this.registerRoute('GET', ':table', this.selectAll);
        this.registerRoute('GET', ':table/:id', this.selectById);
        this.registerRoute('POST', ':table', this.insertRow);
        this.registerRoute('PUT', ':table/:id', this.updateRow);
        this.registerRoute('DELETE', ':table/:id', this.deleteRow);
    }
}
exports.DataAccessController = DataAccessController;
const handlePromiseError = (res) => (data) => {
    console.error('ERROR: ', data);
    res.statusCode = 500;
    res.send(data);
};
//# sourceMappingURL=data-access.controller.js.map