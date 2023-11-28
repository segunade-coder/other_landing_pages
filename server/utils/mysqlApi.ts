import connection from "../config/conn";
import validator from "validator";
import mysql, { Connection } from "mysql";
type TableType = string;
class dbQueries {
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }
  createTable = (
    table: TableType,
    ...params:
      | [
          {
            columnName: string;
            dataType: string;
            condition?: string;
            dataTypeLength?: string;
          }
        ]
      | any[]
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      let query_string: string = ``;
      let columnNames: string[] = [];
      let dataType: string[] = [];
      let condition: string[] | any = [];
      let dataTypeLength: any[] = [];
      let qry = "";
      params.forEach((param) => {
        columnNames.push(param.columnName);
        dataType.push(param.dataType);
        param?.dataTypeLength !== undefined
          ? dataTypeLength.push("(" + param?.dataTypeLength + ")")
          : dataTypeLength.push(null);

        condition.push(param?.condition || null);
      });

      for (let i = 0; i < columnNames.length; i++) {
        qry += `${columnNames[i]} ${dataType[i].toUpperCase()}${
          dataTypeLength[i] || ""
        } ${condition[i] || ""} ${i === columnNames.length - 1 ? "" : ","} `;
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
  query = (query: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };
  queryString = (query: string, options: any = []): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, options, (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  get returnConnection() {
    return this.connection;
  }
  insert = (table: string, values: any) => {
    if (typeof table !== "string" && typeof values !== "object") {
      return new Promise((_resolve, reject) =>
        reject(new SyntaxError("Must be of type 'string'"))
      );
    }
    return new Promise((resolve, reject) => {
      let keyArray = [];
      let valueArray = [];
      let sqlInject = [];
      for (let key in values) {
        keyArray.push(key);
        valueArray.push(`${mysql.escape(values[key as keyof typeof values])}`);
        sqlInject.push("?");
      }
      let sql = `INSERT INTO ${table} (${keyArray.join(
        ", "
      )}) VALUES(${valueArray.join(", ")})`;
      this.connection.query(sql, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };
}

const db = new dbQueries(connection);
export default db;
