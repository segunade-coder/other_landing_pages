import { Router } from "express";
import loginRoute from "./login/route";
import signupRoute from "./signup/route";
const router = Router();

router.use("/login", loginRoute);
router.use("/sign-up", signupRoute);

export default router;
