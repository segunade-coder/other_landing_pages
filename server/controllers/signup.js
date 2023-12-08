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
exports.form = exports.schools = exports.verifyOTP = exports.verifyEmail = void 0;
const functions_1 = require("../utils/functions");
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!(0, functions_1.checkIfEmpty)(email)[0]) {
            const OTP = (0, functions_1.randomOTP)(5);
            const OTP_TIME = `${OTP}::_${new Date().toJSON()}`;
            const data = yield mysqlApi_1.default.query(`SELECT email FROM users WHERE email = '${email}' AND verified_email = 'success'`);
            if (data.length === 0) {
                const data2 = yield mysqlApi_1.default.query(`SELECT email FROM users WHERE email = '${email}' AND verified_email = 'pending'`);
                yield (0, functions_1.sendEmail)("Ush Engineering Team", "Verify Email", email, (0, functions_1.verifyEmailTemplate)(OTP));
                if (data2.length > 0) {
                    yield mysqlApi_1.default.query(`UPDATE users SET verification_code = '${OTP_TIME}'`);
                }
                else {
                    yield mysqlApi_1.default.insert("users", {
                        email,
                        verification_code: OTP_TIME,
                        verified_email: "pending",
                    });
                }
                (0, functions_1.returnJSONSuccess)(res, { message: `?email=${email}` });
            }
            else {
                (0, functions_1.returnJSONError)(res, { message: "Email address already exist" });
            }
        }
        else {
            (0, functions_1.returnJSONError)(res, { message: "No email provided" });
        }
    }
    catch (error) {
        console.log(error);
        (0, functions_1.returnJSONError)(res, { message: error });
    }
});
exports.verifyEmail = verifyEmail;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { OTP, email } = req.body;
    try {
        if (email && OTP !== "") {
            const data = yield mysqlApi_1.default.query(`SELECT verification_code FROM users WHERE email = '${email}'`);
            const { verification_code } = data[0];
            const [code, time] = verification_code.split("::_");
            const minute_to_expire = -10;
            const expired = Math.floor((new Date(time).valueOf() - new Date().valueOf()) / 1000 / 60);
            if (code === OTP) {
                if (expired > minute_to_expire) {
                    yield mysqlApi_1.default.query(`UPDATE users SET verification_code = '', verified_email = 'success' WHERE email = '${email}'`);
                    (0, functions_1.returnJSONSuccess)(res);
                }
                else {
                    (0, functions_1.returnJSONError)(res, { message: "OTP has expired" }, 200);
                }
            }
            else {
                (0, functions_1.returnJSONError)(res, { message: "Wrong OTP" }, 200);
            }
        }
        else {
            (0, functions_1.returnJSONError)(res);
        }
    }
    catch (error) {
        (0, functions_1.returnJSONError)(res);
    }
});
exports.verifyOTP = verifyOTP;
const schools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield mysqlApi_1.default.query("SELECT school_Id, name FROM school");
        (0, functions_1.returnJSONSuccess)(res, { data });
    }
    catch (error) {
        console.log(error);
        (0, functions_1.returnJSONError)(res, { message: "Unable to fetch schools" }, 500);
    }
});
exports.schools = schools;
const form = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password, confirmPassword, position, isSchoolAccount, school, } = req.body;
        if ((0, functions_1.checkIfEmpty)(email, username, password, confirmPassword, position, isSchoolAccount).length === 0) {
            let verifyIfExist = yield mysqlApi_1.default.query(`SELECT username, password FROM users WHERE email = '${email}'`);
            if (verifyIfExist[0].username !== "" &&
                verifyIfExist[0].username !== null &&
                verifyIfExist[0].password !== "" &&
                verifyIfExist[0].password !== null)
                return (0, functions_1.returnJSONError)(res, {
                    message: "Email already registered with another user",
                });
            if (isSchoolAccount === "yes" && (school === "" || school === null))
                return (0, functions_1.returnJSONError)(res, { message: "Select school" }, 200);
            if (password !== confirmPassword)
                return (0, functions_1.returnJSONError)(res, { message: "Passwords does not match" }, 200);
            const data = yield mysqlApi_1.default.query(`SELECT email FROM users WHERE verified_email = 'success' AND email = '${email}'`);
            if (data.length > 0) {
                yield mysqlApi_1.default.query(`UPDATE users SET username = '${username}', password = '${password}', status = '${position}', schoolID ='${school}'`);
                (0, functions_1.returnJSONSuccess)(res);
            }
            else {
                (0, functions_1.returnJSONError)(res, {
                    message: "Email address not verified",
                    redirect: true,
                }, 200);
            }
        }
        else {
            (0, functions_1.returnJSONError)(res, { message: "Fill in all fields" }, 200);
        }
    }
    catch (error) {
        console.log(error);
        (0, functions_1.returnJSONError)(res, { error });
    }
});
exports.form = form;
