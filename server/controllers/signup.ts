import { Request, Response } from "express";

import {
  checkIfEmpty,
  randomOTP,
  returnJSONError,
  returnJSONSuccess,
  sendEmail,
  verifyEmailTemplate,
} from "../utils/functions";
import db from "../utils/mysqlApi";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email }: { email: string } = req.body;
    if (!checkIfEmpty(email)[0]) {
      const OTP = randomOTP(5);
      const OTP_TIME = `${OTP}::_${new Date().toJSON()}`;
      const data = await db.query(
        `SELECT email FROM users WHERE email = '${email}' AND verified_email = 'success'`
      );
      if (data.length === 0) {
        const data2 = await db.query(
          `SELECT email FROM users WHERE email = '${email}' AND verified_email = 'pending'`
        );

        await sendEmail(
          "Ush Engineering Team",
          "Verify Email",
          email,
          verifyEmailTemplate(OTP)
        );
        if (data2.length > 0) {
          await db.query(`UPDATE users SET verification_code = '${OTP_TIME}'`);
        } else {
          await db.insert("users", {
            email,
            verification_code: OTP_TIME,
            verified_email: "pending",
          });
        }
        returnJSONSuccess(res, { message: `?email=${email}` });
      } else {
        returnJSONError(res, { message: "Email address already exist" });
      }
    } else {
      returnJSONError(res, { message: "No email provided" });
    }
  } catch (error) {
    console.log(error);
    returnJSONError(res, { message: error });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { OTP, email }: { OTP: string; email: string } = req.body;

  try {
    if (email && OTP !== "") {
      const data = await db.query(
        `SELECT verification_code FROM users WHERE email = '${email}'`
      );
      const { verification_code } = data[0];
      const [code, time] = verification_code.split("::_");
      const minute_to_expire = -10;
      const expired = Math.floor(
        (new Date(time).valueOf() - new Date().valueOf()) / 1000 / 60
      );
      if (code === OTP) {
        if (expired > minute_to_expire) {
          await db.query(
            `UPDATE users SET verification_code = '', verified_email = 'success' WHERE email = '${email}'`
          );
          returnJSONSuccess(res);
        } else {
          returnJSONError(res, { message: "OTP has expired" }, 200);
        }
      } else {
        returnJSONError(res, { message: "Wrong OTP" }, 200);
      }
    } else {
      returnJSONError(res);
    }
  } catch (error) {
    returnJSONError(res);
  }
};
export const schools = async (req: Request, res: Response) => {
  try {
    const data = await db.query("SELECT school_Id, name FROM school");
    returnJSONSuccess(res, { data });
  } catch (error) {
    console.log(error);
    returnJSONError(res, { message: "Unable to fetch schools" }, 500);
  }
};
export const form = async (req: Request, res: Response) => {
  try {
    const {
      email,
      username,
      password,
      confirmPassword,
      position,
      isSchoolAccount,
      school,
    } = req.body;
    if (
      checkIfEmpty(
        email,
        username,
        password,
        confirmPassword,
        position,
        isSchoolAccount
      ).length === 0
    ) {
      let verifyIfExist = await db.query(
        `SELECT username, password FROM users WHERE email = '${email}'`
      );
      if (
        verifyIfExist[0]?.username !== "" &&
        verifyIfExist[0]?.username !== null &&
        verifyIfExist[0]?.username !== undefined &&
        verifyIfExist[0]?.password !== "" &&
        verifyIfExist[0]?.password !== undefined &&
        verifyIfExist[0]?.password !== null
      )
        return returnJSONError(
          res,
          {
            message: "Email already registered with another user",
          },
          200
        );
      if (isSchoolAccount === "yes" && (school === "" || school === null))
        return returnJSONError(res, { message: "Select school" }, 200);
      if (password !== confirmPassword)
        return returnJSONError(
          res,
          { message: "Passwords does not match" },
          200
        );
      const data = await db.query(
        `SELECT email FROM users WHERE verified_email = 'success' AND email = '${email}'`
      );

      if (data.length > 0) {
        await db.query(
          `UPDATE users SET username = '${username}', password = '${password}', status = '${position}', schoolID ='${school}' WHERE email = '${email}'`
        );
        returnJSONSuccess(res);
      } else {
        returnJSONError(
          res,
          {
            message: "Email address not verified",
            redirect: true,
          },
          200
        );
      }
    } else {
      returnJSONError(res, { message: "Fill in all fields" }, 200);
    }
  } catch (error) {
    console.log(error);
    returnJSONError(res, { error });
  }
};

export const adminForm = async (req: Request, res: Response) => {
  try {
    const buffer = req.file?.buffer;
    const isEmpty = checkIfEmpty(req.body);
    if (isEmpty.length === 0) {
      const {
        schoolName,
        schoolAddress,
        email,
        number,
        schoolPassword,
        confirmPassword,
        schoolPopulation,
      } = req.body;
      if (confirmPassword !== schoolPassword)
        return returnJSONError(res, { message: "Passwords does not match" });
      db.insert("school", {
        name: schoolName.trim(),
        address: schoolAddress.trim(),
        phone: number,
        email,
        logo: buffer,
        schoolPassword,
      });
      returnJSONSuccess(res);
    } else {
      returnJSONError(res, { message: isEmpty[0] }, 200);
    }
  } catch (error) {
    console.log(error);
    returnJSONError(res, { error }, 500);
  }
};
export const packages = async (req: Request, res: Response) => {
  try {
    const data = await db.query("SELECT * FROM packages");

    returnJSONSuccess(res, { data });
  } catch (error) {
    returnJSONError(res, { error });
  }
};
