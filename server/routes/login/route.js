"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../../controllers/login");
const router = (0, express_1.Router)();
router.post("/", login_1.login);
router.post("/reset-password", login_1.resetPassword);
router.post("/reset", login_1.reset);
exports.default = router;
