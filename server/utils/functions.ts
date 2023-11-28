import dotenv from "dotenv";
import mysql from "mysql";
dotenv.config({ path: "../.env" });

import validator from "validator";
import bcrypt from "bcrypt";
import { Response } from "express";

const generateRandomId = function (): string {
  let randomValues: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return randomValues
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

const hash = async (string: string): Promise<string> => {
  try {
    if (!validator.isEmpty(string)) {
      return await bcrypt.hash(string, Number(process.env.HASH_SECRET));
    }
    return Promise.reject("String passed in is empty");
  } catch (error) {
    console.log(error);
    return Promise.reject("String passed in is empty");
  }
};
const compareHash = async (
  string1: string,
  string2: string
): Promise<boolean> => {
  try {
    if (!validator.isEmpty(string1) && !validator.isEmpty(string2)) {
      return await bcrypt.compare(string1, string2);
    } else return Promise.reject("Strings are empty");
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
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

type get_empty = {
  name: string;
  id: number | string;
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
  compareHash,
  hash,
  generateRandomId,
  returnJSONSuccess,
  returnJSONError,
  checkIfEmpty,
};
