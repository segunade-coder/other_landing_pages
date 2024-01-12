import { Request, Response, Router } from "express";
import db from "../../utils/mysqlApi";
import {
  checkIfEmpty,
  returnJSONError,
  returnJSONSuccess,
} from "../../utils/functions";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      schoolName,
      referralSource,
      schoolRange,
      desiredResult,
    } = req.body;
    const isEmpty = checkIfEmpty(
      { "First Name": firstName },
      { "Last Name": lastName },
      { "School Name": schoolName },
      { "School Range": schoolRange },
      { Referral: referralSource },
      { "Desired Output": desiredResult }
    );
    if (isEmpty.length) {
      return returnJSONError(res, { message: isEmpty[0] });
    } else {
      await db.insert("contact_requests", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        school_name: schoolName.trim(),
        capacity_ranges: schoolRange.trim(),
        referral_source: referralSource.trim(),
        desired_results: desiredResult.trim(),
      });
    }
    const data = await db.query(
      `SELECT id FROM contact_requests WHERE first_name = '${firstName.trim()}' AND school_name = '${schoolName}' ORDER BY id DESC LIMIT 1`
    );
    returnJSONSuccess(res, { data: data[0]?.id });
  } catch (error) {
    console.log(error);
    returnJSONError(res, { message: error });
  }
});
router.post("/schedule", async (req: Request, res: Response) => {
  try {
    const { id, date, time } = req.body;
    const isEmpty = checkIfEmpty({ date }, { time }, { id });
    if (isEmpty.length) {
      return returnJSONError(res, { message: isEmpty[0] });
    } else {
      await db.query(
        `UPDATE contact_requests SET time = '${time}', date = '${date}' WHERE id = ${id}`
      );
      returnJSONSuccess(res);
    }
  } catch (error) {
    console.log(error);
    returnJSONError(res, { message: error });
  }
});

export default router;
