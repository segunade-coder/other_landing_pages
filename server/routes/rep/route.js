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
const express_1 = require("express");
const mysqlApi_1 = __importDefault(require("../../utils/mysqlApi"));
const functions_1 = require("../../utils/functions");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { firstName, lastName, schoolName, referralSource, schoolRange, desiredResult, } = req.body;
        const isEmpty = (0, functions_1.checkIfEmpty)({ "First Name": firstName }, { "Last Name": lastName }, { "School Name": schoolName }, { "School Range": schoolRange }, { Referral: referralSource }, { "Desired Output": desiredResult });
        if (isEmpty.length) {
            return (0, functions_1.returnJSONError)(res, { message: isEmpty[0] });
        }
        else {
            yield mysqlApi_1.default.insert("contact_requests", {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                school_name: schoolName.trim(),
                capacity_ranges: schoolRange.trim(),
                referral_source: referralSource.trim(),
                desired_results: desiredResult.trim(),
            });
        }
        const data = yield mysqlApi_1.default.query(`SELECT id FROM contact_requests WHERE first_name = '${firstName.trim()}' AND school_name = '${schoolName}' ORDER BY id DESC LIMIT 1`);
        (0, functions_1.returnJSONSuccess)(res, { data: (_a = data[0]) === null || _a === void 0 ? void 0 : _a.id });
    }
    catch (error) {
        console.log(error);
        (0, functions_1.returnJSONError)(res, { message: error });
    }
}));
router.post("/schedule", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, date, time } = req.body;
        const isEmpty = (0, functions_1.checkIfEmpty)({ date }, { time }, { id });
        if (isEmpty.length) {
            return (0, functions_1.returnJSONError)(res, { message: isEmpty[0] });
        }
        else {
            yield mysqlApi_1.default.query(`UPDATE contact_requests SET time = '${time}', date = '${date}' WHERE id = ${id}`);
            (0, functions_1.returnJSONSuccess)(res);
        }
    }
    catch (error) {
        console.log(error);
        (0, functions_1.returnJSONError)(res, { message: error });
    }
}));
exports.default = router;
