import dotenv from "dotenv";
import mysql from "mysql";
dotenv.config({ path: "../.env" });
import { Response } from "express";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

const generateRandomId = function (): string {
  let randomValues: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return randomValues
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendEmail = (from: string, subject: string, to: string, html: any) => {
  const mailOptions: MailOptions = {
    from: from + " <ushengineering@gmail.com>",
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error in sending email  " + error);
      return true;
    } else {
      console.log("Email sent: " + info.response);
      return false;
    }
  });
};

sendEmail(
  "Ush Engineering Team",
  "verify your email",
  "segunade041@gmail.com",
  "<p>Click on the fucking link <a href='http://localhost:5000/verify_link?token=" +
    generateRandomId() +
    ">click here</a></p>"
);

const returnJSONSuccess = (
  responseObject: Response,
  rest?: object | undefined,
  status = 200
) => {
  responseObject.status(status);
  return responseObject.json({
    status: true,
    message: "Successful",
    ...rest,
  });
};
const returnJSONError = (
  responseObject: Response,
  rest?: object | undefined,
  status = 400
) => {
  responseObject.status(status);
  responseObject.json({
    status: false,
    message: "Error: An error occurred",
    ...rest,
  });
};

const escape = (value: any) => mysql.escape(value);
const checkIfEmpty = (values: object[]): string[] => {
  let errors: string[] = [];
  values.forEach((value) => {
    let objValues = Object.values(value)[0] || null;
    if (objValues === "" || objValues === null || objValues === undefined) {
      let objKey = Object.keys(value);
      errors.push(`${objKey[0]} should not be empty`);
    }
  });
  return errors;
};
export {
  generateRandomId,
  returnJSONSuccess,
  returnJSONError,
  checkIfEmpty,
  escape,
};
