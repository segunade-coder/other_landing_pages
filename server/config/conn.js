"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
// mysql apache credentials for connecting to xampp without database
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const db_cred = {
    host: process.env.DATABASE_HOST || '',
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || '',
    port: parseInt(process.env.MYSQL_PORT || "3306"),
};
// create a database connection with the credentials above
const connection = mysql_1.default.createConnection(db_cred);
//connect to the apache server
connection.connect((err) => {
    if (err) {
        console.log("App started. Error connecting to database", err);
        console.log("Error connecting to apache database", __filename);
        throw err;
    }
    else {
        // logToFile("App started. Connected to apache server successfully");
        // console.log("connected to apache database...");
    }
});
// export the connection
exports.default = connection;
