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
exports.reset = exports.resetPassword = exports.login = void 0;
const functions_1 = require("../utils/functions");
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    let validity = (0, functions_1.checkIfEmpty)({ email }, { password });
    if (validity.length > 0) {
        return res.json({
            status: false,
            message: validity[0],
        });
    }
    else {
        try {
            const data = yield mysqlApi_1.default.queryString("SELECT userid, password FROM users WHERE email = ?", [email]);
            if (data.length > 0) {
                const dbPassword = data[0].password;
                if (password === dbPassword) {
                    return (0, functions_1.returnJSONSuccess)(res);
                }
                else {
                    (0, functions_1.returnJSONError)(res, { message: "invalid password provided" });
                }
            }
            else {
                return (0, functions_1.returnJSONError)(res, {
                    message: "Invalid email address provided",
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
});
exports.login = login;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = req.body;
    let validity = (0, functions_1.checkIfEmpty)({ email });
    if (validity.length > 0) {
        return res.json({
            status: false,
            message: validity[0],
        });
    }
    else {
        try {
            const OTP = `${(0, functions_1.generateRandomId)()}::_${new Date().toJSON()}`;
            let result = yield (0, functions_1.sendEmail)("Ush Engineering Team", "Reset password", email, (0, functions_1.resetPasswordTemplate)(email, OTP));
            if (result.status) {
                yield mysqlApi_1.default.query(`UPDATE users SET verification_code = '${OTP}' WHERE email = '${email}'`);
                (0, functions_1.returnJSONSuccess)(res);
            }
            else {
                (0, functions_1.returnJSONError)(res, { message: "Unable to send email" });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
});
exports.resetPassword = resetPassword;
const reset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, newPassword, code, confirmNewPassword, } = req.body;
    if (newPassword !== confirmNewPassword) {
        return (0, functions_1.returnJSONError)(res, { message: "Password does not match" });
    }
    let validity = (0, functions_1.checkIfEmpty)({ email, code, password: newPassword });
    if (validity.length > 0) {
        return res.json({
            status: false,
            message: validity[0],
        });
    }
    else {
        try {
            console.log(email, newPassword, code, confirmNewPassword);
            let data = yield mysqlApi_1.default.query(`SELECT email, verification_code FROM users WHERE email = '${email}'`);
            if (data.length > 0) {
                const verification_code = data[0].verification_code;
                if (verification_code && verification_code !== "") {
                    let [vc, date] = verification_code.split("::_");
                    const minute_to_expire = -10;
                    const expired = Math.floor((new Date(date).valueOf() - new Date().valueOf()) / 1000 / 60);
                    if (expired > minute_to_expire) {
                        if (verification_code === code) {
                            yield mysqlApi_1.default.query(`UPDATE users SET password = '${newPassword}', verification_code = '' WHERE email = '${email}'`);
                            (0, functions_1.returnJSONSuccess)(res);
                        }
                        else {
                            (0, functions_1.returnJSONError)(res, { message: "Invalid Verification code" });
                        }
                    }
                    else {
                        (0, functions_1.returnJSONError)(res, { message: "Time has expired" });
                    }
                }
                else {
                    (0, functions_1.returnJSONError)(res, { message: "Something went wrong" });
                }
            }
            else {
                (0, functions_1.returnJSONError)(res, { message: "Invalid credentials provided" });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
});
exports.reset = reset;
