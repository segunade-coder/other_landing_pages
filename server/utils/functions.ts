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

const sendEmail = async (
  from: string = "Ush Engineering Team",
  subject: string,
  to: string,
  html: any
) => {
  const mailOptions: MailOptions = {
    from: from + " <ushengineering@gmail.com>",
    to,
    subject,
    html,
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    return {
      status: true,
      message: result,
    };
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
};

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
const randomOTP = (repeatNumber: number = 5) =>
  Math.floor(Math.random() * parseInt("9".repeat(repeatNumber)));
const escape = (value: any) => mysql.escape(value);
const checkIfEmpty = <T>(...values: T[]): (string | undefined | boolean)[] => {
  let array_of_errors: (string | undefined | boolean)[] = [];

  values.forEach((value, i) => {
    if (value) {
      if (typeof value === "string") {
        if (value === "" || value === null || value === undefined) {
          array_of_errors.push(true);
        }
      }
      if (typeof value === "object") {
        for (const key in value) {
          if (
            value[key] === "" ||
            value[key] === null ||
            value[key] === undefined
          ) {
            array_of_errors.push(`${key} is required`);
          }
        }
      }
    } else {
      array_of_errors.push(true);
    }
  });
  return array_of_errors;
};
export const resetPasswordTemplate = (email: string, OTP: number | string) => `
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
  <p>
    We've received a request to reset the password for this user account
  </p>
  <br />
  <a
    href="http://dev.app.rapidsuite.ng/reset?user=${email}&vc=${OTP}"
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
    If you didn't ask to reset your password, you can ignore this email. This code becomes invalid after 10 minutes
  </p>
  <p style="font-size: small; margin-top: 0.5rem">
    Thanks <br />
    Ush Engineering Team
  </p>
</div>
</div>`;

export const verifyEmailTemplate = (OTP: number) => `
<div style="padding:1rem;">
<h4>Verify your email address.</h4>
<p>To verify your email address, please use the following One-Time-Password (OTP)</p>
<h2 style="padding: 1rem 0;">${OTP}</h2>
<p>Do not share this OTP with anyone. This OTP is rendered invalid after 10 minutes.</p>
</div>
`;
export {
  generateRandomId,
  returnJSONSuccess,
  returnJSONError,
  checkIfEmpty,
  randomOTP,
  escape,
  sendEmail,
};
