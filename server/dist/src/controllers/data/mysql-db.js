"use strict";
/// <reference types="@types/mysql" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlDbPool = exports.singleResult = void 0;
const mysql = require("mysql");
const singleResult = (rows, fields) => rows[0] || null;
exports.singleResult = singleResult;
class MySqlDbPool {
    constructor(config) {
        this.config = config;
        this.pool = mysql.createPool(config);
    }
    query(commandText, params, transform = null) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, cn) => {
                if (err) {
                    console.error('Problem getting connection:', err);
                    reject(err);
                }
                cn.query(commandText, params, (error, rows, fields) => {
                    if (error) {
                        console.error('Error with query:', error, {
                            commandText,
                            params,
                        });
                        reject(error);
                    }
                    else {
                        if (transform != null) {
                            resolve(transform(rows, fields));
                        }
                        resolve({ rows, fields });
                    }
                });
            });
        });
    }
    insert(table, obj) {
        const columnNames = Object.keys(obj).join(', ');
        const placeholders = Object.keys(obj)
            .map((n) => '?')
            .join(', ');
        const commandText = `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`;
        const values = Object.values(obj);
        return this.query(commandText, values);
    }
    update(table, key, obj) {
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
    delete(table, key) {
        const matchers = Object.keys(key)
            .map((col) => `${col} = ?`)
            .join(', ');
        const values = [...Object.values(key)];
        const commandText = `DELETE FROM ${table} WHERE ${matchers}`;
        return this.query(commandText, values, logTransformFn);
    }
    selectByKey(table, key) {
        const matchers = Object.keys(key)
            .map((col) => `${col} = ?`)
            .join(' AND ');
        const commandText = `SELECT * FROM ${table} WHERE ${matchers} LIMIT 1`;
        const values = Object.values(key);
        return this.query(commandText, values, exports.singleResult);
    }
}
exports.MySqlDbPool = MySqlDbPool;
const logTransformFn = (data) => {
    console.log('QueryResult:', data);
    return data;
};
//# sourceMappingURL=mysql-db.js.map