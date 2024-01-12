import { Router } from "express";
import {
  form,
  verifyEmail,
  verifyOTP,
  schools,
  adminForm,
  packages,
} from "../../controllers/signup";
const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const router = Router();

router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOTP);
router.post("/form", form);
router.get("/schools", schools);
router.get("/packages", packages);
router.post("/admin", upload.single("school_logo"), adminForm);
export default router;
