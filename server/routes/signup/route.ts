import { Router } from "express";
import {
  form,
  verifyEmail,
  verifyOTP,
  schools,
} from "../../controllers/signup";

const router = Router();

router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOTP);
router.post("/form", form);
router.get("/schools", schools);
export default router;
