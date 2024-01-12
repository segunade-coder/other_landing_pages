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
exports.packages = exports.adminForm = exports.form = exports.schools = exports.verifyOTP = exports.verifyEmail = void 0;
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
    var _a, _b, _c, _d, _e, _f;
    try {
        const { email, username, password, confirmPassword, position, isSchoolAccount, school, } = req.body;
        if ((0, functions_1.checkIfEmpty)(email, username, password, confirmPassword, position, isSchoolAccount).length === 0) {
            let verifyIfExist = yield mysqlApi_1.default.query(`SELECT username, password FROM users WHERE email = '${email}'`);
            if (((_a = verifyIfExist[0]) === null || _a === void 0 ? void 0 : _a.username) !== "" &&
                ((_b = verifyIfExist[0]) === null || _b === void 0 ? void 0 : _b.username) !== null &&
                ((_c = verifyIfExist[0]) === null || _c === void 0 ? void 0 : _c.username) !== undefined &&
                ((_d = verifyIfExist[0]) === null || _d === void 0 ? void 0 : _d.password) !== "" &&
                ((_e = verifyIfExist[0]) === null || _e === void 0 ? void 0 : _e.password) !== undefined &&
                ((_f = verifyIfExist[0]) === null || _f === void 0 ? void 0 : _f.password) !== null)
                return (0, functions_1.returnJSONError)(res, {
                    message: "Email already registered with another user",
                }, 200);
            if (isSchoolAccount === "yes" && (school === "" || school === null))
                return (0, functions_1.returnJSONError)(res, { message: "Select school" }, 200);
            if (password !== confirmPassword)
                return (0, functions_1.returnJSONError)(res, { message: "Passwords does not match" }, 200);
            const data = yield mysqlApi_1.default.query(`SELECT email FROM users WHERE verified_email = 'success' AND email = '${email}'`);
            if (data.length > 0) {
                yield mysqlApi_1.default.query(`UPDATE users SET username = '${username}', password = '${password}', status = '${position}', schoolID ='${school}' WHERE email = '${email}'`);
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
const adminForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const buffer = (_g = req.file) === null || _g === void 0 ? void 0 : _g.buffer;
        const isEmpty = (0, functions_1.checkIfEmpty)(req.body);
        if (isEmpty.length === 0) {
            const { schoolName, schoolAddress, email, number, schoolPassword, confirmPassword, schoolPopulation, } = req.body;
            if (confirmPassword !== schoolPassword)
                return (0, functions_1.returnJSONError)(res, { message: "Passwords does not match" });
            mysqlApi_1.default.insert("school", {
                name: schoolName.trim(),
                address: schoolAddress.trim(),
                phone: number,
                email,
                logo: buffer,
                schoolPassword,
            });
            (0, functions_1.returnJSONSuccess)(res);
        }
        else {
            (0, functions_1.returnJSONError)(res, { message: isEmpty[0] }, 200);
        }
    }
    catch (error) {
        console.log(error);
        (0, functions_1.returnJSONError)(res, { error }, 500);
    }
});
exports.adminForm = adminForm;
const packages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield mysqlApi_1.default.query("SELECT * FROM packages");
        (0, functions_1.returnJSONSuccess)(res, { data });
    }
    catch (error) {
        (0, functions_1.returnJSONError)(res, { error });
    }
});
exports.packages = packages;
