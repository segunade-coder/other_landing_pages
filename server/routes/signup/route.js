"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_1 = require("../../controllers/signup");
const router = (0, express_1.Router)();
router.post("/verify-email", signup_1.verifyEmail);
router.post("/verify-otp", signup_1.verifyOTP);
router.post("/form", signup_1.form);
router.get("/schools", signup_1.schools);
exports.default = router;
