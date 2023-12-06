import { Request, Response } from "express";
import {
  checkIfEmpty,
  generateRandomId,
  randomOTP,
  resetPasswordTemplate,
  returnJSONError,
  returnJSONSuccess,
  sendEmail,
} from "../utils/functions";
import db from "../utils/mysqlApi";

export const login = async (req: Request, res: Response) => {
  let { email, password }: { email: string; password: string } = req.body;

  let validity = checkIfEmpty({ email }, { password });
  if (validity.length > 0) {
    return res.json({
      status: false,
      message: validity[0],
    });
  } else {
    try {
      const data = await db.queryString(
        "SELECT userid, password FROM users WHERE email = ?",
        [email]
      );
      if (data.length > 0) {
        const dbPassword = data[0].password;
        if (password === dbPassword) {
          return returnJSONSuccess(res);
        } else {
          returnJSONError(res, { message: "invalid password provided" });
        }
      } else {
        return returnJSONError(res, {
          message: "Invalid email address provided",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  let { email }: { email: string } = req.body;

  let validity = checkIfEmpty({ email });
  if (validity.length > 0) {
    return res.json({
      status: false,
      message: validity[0],
    });
  } else {
    try {
      const OTP = `${generateRandomId()}::_${new Date().toJSON()}`;
      let result = await sendEmail(
        "Ush Engineering Team",
        "Reset password",
        email,
        resetPasswordTemplate(email, OTP)
      );
      if (result.status) {
        await db.query(
          `UPDATE users SET verification_code = '${OTP}' WHERE email = '${email}'`
        );
        returnJSONSuccess(res);
      } else {
        returnJSONError(res, { message: "Unable to send email" });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
export const reset = async (req: Request, res: Response) => {
  let {
    email,
    newPassword,
    code,
    confirmNewPassword,
  }: {
    email: string;
    newPassword: string;
    code: string;
    confirmNewPassword: string;
  } = req.body;

  if (newPassword !== confirmNewPassword) {
    return returnJSONError(res, { message: "Password does not match" });
  }
  let validity = checkIfEmpty({ email, code, password: newPassword });
  if (validity.length > 0) {
    return res.json({
      status: false,
      message: validity[0],
    });
  } else {
    try {
      console.log(email, newPassword, code, confirmNewPassword);
      let data = await db.query(
        `SELECT email, verification_code FROM users WHERE email = '${email}'`
      );

      if (data.length > 0) {
        const verification_code: string = data[0].verification_code;
        if (verification_code && verification_code !== "") {
          let [vc, date] = verification_code.split("::_");
          const minute_to_expire = -10;
          const expired = Math.floor(
            (new Date(date).valueOf() - new Date().valueOf()) / 1000 / 60
          );
          if (expired > minute_to_expire) {
            if (verification_code === code) {
              await db.query(
                `UPDATE users SET password = '${newPassword}', verification_code = '' WHERE email = '${email}'`
              );
              returnJSONSuccess(res);
            } else {
              returnJSONError(res, { message: "Invalid Verification code" });
            }
          } else {
            returnJSONError(res, { message: "Time has expired" });
          }
        } else {
          returnJSONError(res, { message: "Something went wrong" });
        }
      } else {
        returnJSONError(res, { message: "Invalid credentials provided" });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
