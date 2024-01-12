"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const functions_1 = require("../utils/functions");
const schedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield mysqlApi_1.default.createTable("schedule", {
        columnName: "school_id",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "50",
    }, {
        columnName: "date",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "50",
    }, {
        columnName: "time",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "50",
    });
    const { date, time } = req.body;
    let isEmpty = (0, functions_1.checkIfEmpty)({ date, time });
    if (isEmpty.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: isEmpty[0] });
    }
    yield mysqlApi_1.default.queryString("INSERT INTO schedule (school_Id)");
});
