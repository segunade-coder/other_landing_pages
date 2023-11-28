"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = exports.sessionConfig = exports.sessionStore = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const storeConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.MYSQL_PORT,
    clearExpired: true,
    checkExpirationInterval: 50000,
    expiration: 1000 * 60 * 60 * 24,
    createDatabaseTable: true,
    connectionLimit: 1,
    endconnectionOnClose: true,
    charset: "utf8mb4_bin",
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data",
        },
    },
};
const sessionStore = new MysqlStore(storeConfig);
exports.sessionStore = sessionStore;
const sessionConfig = {
    secret: "something worth hiding48798",
    saveUninitialized: true,
    resave: false,
    proxy: true,
    name: "finance.payroll.app",
    cookie: {
        httpOnly: true,
    },
};
exports.sessionConfig = sessionConfig;
let origins = ["http://localhost:3000"];
const corsConfig = {
    origin: origins,
    credentials: true,
};
exports.corsConfig = corsConfig;
