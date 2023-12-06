import { Router } from "express";
import loginRoute from "./login/route";
import signupRoute from "./signup/route";
import repRoute from "./rep/route";
const router = Router();

router.use("/login", loginRoute);
router.use("/rep", repRoute);
router.use("/sign-up", signupRoute);

export default router;
