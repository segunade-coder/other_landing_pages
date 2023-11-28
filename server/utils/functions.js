"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = exports.checkIfEmpty = exports.returnJSONError = exports.returnJSONSuccess = exports.generateRandomId = void 0;
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
const sendEmail = (from, subject, to, html) => {
    const mailOptions = {
        from: from + " <ushengineering@gmail.com>",
        to,
        subject,
        html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error in sending email  " + error);
            return true;
        }
        else {
            console.log("Email sent: " + info.response);
            return false;
        }
    });
};
sendEmail("Ush Engineering Team", "verify your email", "segunade041@gmail.com", "<p>Click on the fucking link <a href='http://localhost:5000/verify_link?token=" +
    generateRandomId() +
    ">click here</a></p>");
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
const escape = (value) => mysql_1.default.escape(value);
exports.escape = escape;
const checkIfEmpty = (values) => {
    let errors = [];
    values.forEach((value) => {
        let objValues = Object.values(value)[0] || null;
        if (objValues === "" || objValues === null || objValues === undefined) {
            let objKey = Object.keys(value);
            errors.push(`${objKey[0]} should not be empty`);
        }
    });
    return errors;
};
exports.checkIfEmpty = checkIfEmpty;
