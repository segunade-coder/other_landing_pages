import { Request, Response, Router } from "express";
import db from "../../utils/mysqlApi";
import {
  checkIfEmpty,
  escape,
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

    returnJSONSuccess(res);
  } catch (error) {
    console.log(error);
    returnJSONError(res, { message: error });
  }
});

export default router;
