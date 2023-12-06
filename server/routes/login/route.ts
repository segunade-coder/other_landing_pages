import { Router } from "express";
import { login, reset, resetPassword } from "../../controllers/login";

const router = Router();

router.post("/", login);
router.post("/reset-password", resetPassword);
router.post("/reset", reset);

export default router;
