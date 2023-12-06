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
exports.sendEmail = exports.escape = exports.randomOTP = exports.checkIfEmpty = exports.returnJSONError = exports.returnJSONSuccess = exports.generateRandomId = exports.resetPasswordTemplate = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("mysql"));
dotenv_1.default.config({ path: "../.env" });
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateRandomId = function () {
    let randomValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return randomValues
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
};
exports.generateRandomId = generateRandomId;
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});
const sendEmail = (from, subject, to, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: from + " <ushengineering@gmail.com>",
        to,
        subject,
        html,
    };
    try {
        const result = yield transporter.sendMail(mailOptions);
        return {
            status: true,
            message: result,
        };
    }
    catch (error) {
        return {
            status: false,
            message: error,
        };
    }
});
exports.sendEmail = sendEmail;
const returnJSONSuccess = (responseObject, rest, status = 200) => {
    responseObject.status(status);
    return responseObject.json(Object.assign({ status: true, message: "Successful" }, rest));
};
exports.returnJSONSuccess = returnJSONSuccess;
const returnJSONError = (responseObject, rest, status = 400) => {
    responseObject.status(status);
    responseObject.json(Object.assign({ status: false, message: "Error: An error occurred" }, rest));
};
exports.returnJSONError = returnJSONError;
const randomOTP = (repeatNumber = 5) => Math.floor(Math.random() * parseInt("9".repeat(repeatNumber)));
exports.randomOTP = randomOTP;
const escape = (value) => mysql_1.default.escape(value);
exports.escape = escape;
const checkIfEmpty = (...values) => {
    let array_of_errors = [];
    values.forEach((value, i) => {
        if (value) {
            if (typeof value === "string") {
                if (value === "" || value === null || value === undefined) {
                    array_of_errors.push(true);
                }
            }
            if (typeof value === "object") {
                for (const key in value) {
                    if (value[key] === "" ||
                        value[key] === null ||
                        value[key] === undefined) {
                        array_of_errors.push(`${key} is required`);
                    }
                }
            }
        }
        else {
            array_of_errors.push(true);
        }
    });
    return array_of_errors;
};
exports.checkIfEmpty = checkIfEmpty;
const resetPasswordTemplate = (email, OTP) => `
<div
style="
  padding: 1rem;
  background: transparent;
  color: black;
text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
"
>
<div style=" width: fit-content; padding: 1rem; background-color: white; border-radius: 10px;border: 1px solid #222222; margin: 0 auto;">
  <h3 style="padding-left: 0.5rem">Trouble signing in?</h3>
  <p ">
    We've received a request to reset the password for this user account
  </p>
  <br />
  <a
    href="http://localhost:5500/frontend/resetPassword.html?user=${email}&vc=${OTP}"
    style="
      padding: 0.6rem 1rem;
      background-color: #3a95c9;
      text-decoration: none;
      color: white;
      border-radius: 5px;
      font-size: small;
      margin: 0 auto;
    "
    >Reset your password</a
  >
  <p style="margin-top: 2.5rem; font-size: small">
    If you didn't ask to reset your password, you can ignore this email
  </p>
  <p style="font-size: small; margin-top: 0.5rem">
    Thanks <br />
    Ush Engineering Team
  </p>
</div>
</div>`;
exports.resetPasswordTemplate = resetPasswordTemplate;
