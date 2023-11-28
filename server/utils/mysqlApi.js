"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conn_1 = __importDefault(require("../config/conn"));
const mysql_1 = __importDefault(require("mysql"));
class dbQueries {
    constructor(connection) {
        this.createTable = (table, ...params) => {
            return new Promise((resolve, reject) => {
                let query_string = ``;
                let columnNames = [];
                let dataType = [];
                let condition = [];
                let dataTypeLength = [];
                let qry = "";
                params.forEach((param) => {
                    columnNames.push(param.columnName);
                    dataType.push(param.dataType);
                    (param === null || param === void 0 ? void 0 : param.dataTypeLength) !== undefined
                        ? dataTypeLength.push("(" + (param === null || param === void 0 ? void 0 : param.dataTypeLength) + ")")
                        : dataTypeLength.push(null);
                    condition.push((param === null || param === void 0 ? void 0 : param.condition) || null);
                });
                for (let i = 0; i < columnNames.length; i++) {
                    qry += `${columnNames[i]} ${dataType[i].toUpperCase()}${dataTypeLength[i] || ""} ${condition[i] || ""} ${i === columnNames.length - 1 ? "" : ","} `;
                }
                query_string = `CREATE TABLE IF NOT EXISTS ${table} (id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, ${qry}, last_modified TIMESTAMP NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
                this.connection.query(query_string, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        };
        this.query = (query) => {
            return new Promise((resolve, reject) => {
                this.connection.query(query, (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });
        };
        this.queryString = (query, options = []) => {
            return new Promise((resolve, reject) => {
                this.connection.query(query, options, (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.insert = (table, values) => {
            if (typeof table !== "string" && typeof values !== "object") {
                return new Promise((_resolve, reject) => reject(new SyntaxError("Must be of type 'string'")));
            }
            return new Promise((resolve, reject) => {
                let keyArray = [];
                let valueArray = [];
                let sqlInject = [];
                for (let key in values) {
                    keyArray.push(key);
                    valueArray.push(`${mysql_1.default.escape(values[key])}`);
                    sqlInject.push("?");
                }
                let sql = `INSERT INTO ${table} (${keyArray.join(", ")}) VALUES(${valueArray.join(", ")})`;
                this.connection.query(sql, (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });
        };
        this.connection = connection;
    }
    get returnConnection() {
        return this.connection;
    }
}
const db = new dbQueries(conn_1.default);
exports.default = db;
