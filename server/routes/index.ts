import { Router } from "express";
import loginRoute from "./login/route";
import signupRoute from "./signup/route";
import repRoute from "./rep/route";
const router = Router();

router.use("/login", loginRoute);
router.use("/rep", repRoute);
router.use("/signup", signupRoute);

export default router;
